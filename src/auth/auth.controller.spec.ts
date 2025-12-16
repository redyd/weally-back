import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtRefreshGuard } from './jwt/JwtRefreshGuard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtRefreshGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockLoginResponse = {
      tokens: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      },
      user: {
        id: '123',
        email: 'test@example.com',
        role: 'USER',
      },
    };

    it('devrait retourner des tokens et les infos utilisateur', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockLoginResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });

    it('devrait appeler authService.login avec les bons paramètres', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });

    it('devrait propager les erreurs du service', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('POST /auth/refresh', () => {
    const refreshTokenDto = {
      refresh_token: 'valid-refresh-token',
    };

    const mockRefreshResponse = {
      tokens: {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      },
      user: {
        id: '123',
        email: 'test@example.com',
        role: 'USER',
      },
    };

    it('devrait retourner de nouveaux tokens', async () => {
      mockAuthService.refresh.mockResolvedValue(mockRefreshResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual(mockRefreshResponse);
      expect(mockAuthService.refresh).toHaveBeenCalledWith(refreshTokenDto);
    });

    it('devrait appeler authService.refresh avec le DTO', async () => {
      mockAuthService.refresh.mockResolvedValue(mockRefreshResponse);

      await controller.refreshToken(refreshTokenDto);

      expect(mockAuthService.refresh).toHaveBeenCalledTimes(1);
      expect(mockAuthService.refresh).toHaveBeenCalledWith(refreshTokenDto);
    });

    it('devrait propager les erreurs du service', async () => {
      mockAuthService.refresh.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('devrait être protégé par JwtRefreshGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.refreshToken);
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });
  });
});
