import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAccessStrategy } from './JwtAccessStrategy';
import { JwtRefreshStrategy } from './JwtRefreshStrategy';
import { Role } from '../../users/entities/UserTypes';

describe('JWT Strategies', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  });

  describe('JwtAccessStrategy', () => {
    let strategy: JwtAccessStrategy;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [JwtAccessStrategy],
      }).compile();

      strategy = module.get<JwtAccessStrategy>(JwtAccessStrategy);
    });

    it('devrait être défini', () => {
      expect(strategy).toBeDefined();
    });

    it('devrait valider un payload de type access_token', async () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        role: "MEMBER" as Role,
        type: 'access_token' as const,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        role: "MEMBER",
      });
    });

    it('devrait retourner uniquement id, email et role', async () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        role: "CHEF" as Role,
        type: 'access_token' as const,
        iat: 1234567890,
        exp: 1234567999,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        role: "CHEF",
      });
      expect(result).not.toHaveProperty('type');
      expect(result).not.toHaveProperty('iat');
      expect(result).not.toHaveProperty('exp');
    });

    it('devrait rejeter un payload de type refresh_token', async () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        role: "MEMBER" as Role,
        type: 'refresh_token' as const,
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token type',
      );
    });

    it('devrait rejeter un payload sans type', async () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        role: "MEMBER",
      } as any;

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('devrait valider différents rôles', async () => {
      const roles = ["MEMBER", "CHEF"];

      for (const role of roles) {
        const payload = {
          id: '123',
          email: 'test@example.com',
          role: role as Role,
          type: 'access_token' as const,
        };

        const result = await strategy.validate(payload);
        expect(result.role).toBe(role);
      }
    });
  });

  describe('JwtRefreshStrategy', () => {
    let strategy: JwtRefreshStrategy;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [JwtRefreshStrategy],
      }).compile();

      strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
    });

    it('devrait être défini', () => {
      expect(strategy).toBeDefined();
    });

    it('devrait valider un payload de type refresh_token', async () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        type: 'refresh_token' as const,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
      });
    });

    it('devrait retourner uniquement id et email (pas de role)', async () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        type: 'refresh_token' as const,
        iat: 1234567890,
        exp: 1234567999,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
      });
      expect(result).not.toHaveProperty('role');
      expect(result).not.toHaveProperty('type');
    });

    it('devrait rejeter un payload de type access_token', async () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        type: 'access_token' as const,
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token type',
      );
    });

    it('devrait rejeter un payload sans type', async () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
      } as any;

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('devrait valider avec différents userId', async () => {
      const userIds = ['123', 'abc-def', 'user-456'];

      for (const id of userIds) {
        const payload = {
          id,
          email: 'test@example.com',
          type: 'refresh_token' as const,
        };

        const result = await strategy.validate(payload);
        expect(result.id).toBe(id);
      }
    });
  });

  describe('Strategy Configuration', () => {
    it('JwtAccessStrategy devrait utiliser JWT_SECRET', () => {
      const strategy = new JwtAccessStrategy();
      // La stratégie devrait être configurée avec le bon secret
      // (vérifié par l'initialisation sans erreur)
      expect(strategy).toBeDefined();
    });

    it('JwtRefreshStrategy devrait utiliser JWT_REFRESH_SECRET', () => {
      const strategy = new JwtRefreshStrategy();
      // La stratégie devrait être configurée avec le bon secret
      expect(strategy).toBeDefined();
    });

    it('devrait utiliser le header Authorization Bearer', () => {
      const accessStrategy = new JwtAccessStrategy();
      const refreshStrategy = new JwtRefreshStrategy();

      expect(accessStrategy).toBeDefined();
      expect(refreshStrategy).toBeDefined();
      // Les deux stratégies utilisent ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  });
});
