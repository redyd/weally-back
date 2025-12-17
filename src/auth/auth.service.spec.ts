import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserClient } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    role: "MEMBER",
    strictInfo: jest.fn().mockReturnValue({
      id: '123',
      email: 'test@example.com',
      role: "MEMBER",
    }),
    basicInfo: jest.fn().mockReturnValue({
      id: '123',
      email: 'test@example.com',
      role: "MEMBER",
    }),
  } as unknown as UserClient;

  const mockUsersService = {
    validateUser: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset des mocks avant chaque test
    jest.clearAllMocks();

    // Configuration par défaut des secrets
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  });

  describe('validateUser', () => {
    it('devrait retourner un utilisateur si les credentials sont valides', async () => {
      mockUsersService.validateUser.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });

    it('devrait lancer UnauthorizedException si les credentials sont invalides', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(
        service.validateUser('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.validateUser('test@example.com', 'wrong-password'),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('login', () => {
    it('devrait retourner des tokens et les infos utilisateur lors du login', async () => {
      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await service.login('test@example.com', 'password');

      expect(result).toEqual({
        tokens: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
        },
        user: mockUser,
      });
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });

    it('devrait générer un access token avec le bon payload et configuration', async () => {
      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');

      await service.login('test@example.com', 'password');

      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        1,
        {
          id: '123',
          email: 'test@example.com',
          role: "MEMBER",
          type: 'access_token',
        },
        {
          secret: 'test-secret',
          expiresIn: '15m',
        },
      );
    });

    it('devrait générer un refresh token avec le bon payload et configuration', async () => {
      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');

      await service.login('test@example.com', 'password');

      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        {
          id: '123',
          email: 'test@example.com',
          role: "MEMBER",
          type: 'refresh_token',
        },
        {
          secret: 'test-refresh-secret',
          expiresIn: '14d',
        },
      );
    });

    it('devrait lancer une erreur si la validation échoue', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(
        service.login('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    const validRefreshToken = {
      refresh_token: 'valid-refresh-token',
    };

    it('devrait générer de nouveaux tokens avec un refresh token valide', async () => {
      mockJwtService.verify.mockReturnValue({
        id: '123',
        email: 'test@example.com',
        type: 'refresh_token',
      });
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await service.refresh(validRefreshToken);

      expect(result).toEqual({
        tokens: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
        },
        user: mockUser,
      });
    });

    it('devrait vérifier le refresh token avec le bon secret', async () => {
      mockJwtService.verify.mockReturnValue({
        id: '123',
        email: 'test@example.com',
      });
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');

      await service.refresh(validRefreshToken);

      expect(mockJwtService.verify).toHaveBeenCalledWith(
        'valid-refresh-token',
        {
          secret: 'test-refresh-secret',
        },
      );
    });

    it('devrait lancer UnauthorizedException si le token est invalide', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh(validRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(validRefreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('devrait lancer UnauthorizedException si le token est expiré', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.refresh(validRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("devrait lancer UnauthorizedException si l'utilisateur n'existe plus", async () => {
      mockJwtService.verify.mockReturnValue({
        id: '123',
        email: 'test@example.com',
      });
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.refresh(validRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(validRefreshToken)).rejects.toThrow(
        'User not found',
      );
    });

    it('devrait appeler findOne avec le bon userId', async () => {
      mockJwtService.verify.mockReturnValue({
        id: '123',
        email: 'test@example.com',
      });
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');

      await service.refresh(validRefreshToken);

      expect(mockUsersService.findOne).toHaveBeenCalledWith('123');
    });
  });

  describe('createTokens', () => {
    it('devrait créer des tokens avec les bons payloads', () => {
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = service.createTokens(mockUser);

      expect(result.tokens.access_token).toBe('access-token');
      expect(result.tokens.refresh_token).toBe('refresh-token');
      expect(result.user).toBe(mockUser);
    });

    it('devrait appeler basicInfo() pour le access token', () => {
      mockJwtService.sign.mockReturnValue('mock-token');

      service.createTokens(mockUser);

      expect(mockUser.basicInfo).toHaveBeenCalled();
    });

    it('devrait appeler strictInfo() pour le refresh token', () => {
      mockJwtService.sign.mockReturnValue('mock-token');

      service.createTokens(mockUser);

      expect(mockUser.strictInfo).toHaveBeenCalled();
    });
  });
});
