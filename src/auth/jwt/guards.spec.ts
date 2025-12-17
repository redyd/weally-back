import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../role-guard/RoleGuard';
import { Role } from '../../users/entities/UserTypes';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  const createMockExecutionContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  it('devrait être défini', () => {
    expect(guard).toBeDefined();
  });

  describe('Pas de rôles requis', () => {
    it("devrait autoriser si aucun rôle n'est requis", () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      const context = createMockExecutionContext({
        id: '123',
        role: "MEMBER" as Role,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('devrait autoriser même sans utilisateur si pas de rôles requis', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      const context = createMockExecutionContext(null);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('devrait autoriser avec un tableau de rôles vide', () => {
      mockReflector.getAllAndOverride.mockReturnValue([]);
      const context = createMockExecutionContext({
        id: '123',
        role: "MEMBER" as Role,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  describe('Vérification des rôles', () => {
    it('devrait autoriser un utilisateur avec le bon rôle', () => {
      mockReflector.getAllAndOverride.mockReturnValue(["CHEF"]);
      const context = createMockExecutionContext({
        id: '123',
        email: 'admin@example.com',
        role: "CHEF",
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it("devrait autoriser si l'utilisateur a un des rôles requis", () => {
      mockReflector.getAllAndOverride.mockReturnValue([
        "CHEF",
      ]);
      const context = createMockExecutionContext({
        id: '123',
        role: "CHEF",
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('devrait rejeter un utilisateur sans le bon rôle', () => {
      mockReflector.getAllAndOverride.mockReturnValue(["CHEF"]);
      const context = createMockExecutionContext({
        id: '123',
        role: "MEMBER" as Role,
      });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Insufficient permissions',
      );
    });

    it("devrait rejeter si l'utilisateur n'est pas présent", () => {
      mockReflector.getAllAndOverride.mockReturnValue(["CHEF"]);
      const context = createMockExecutionContext(null);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it("devrait rejeter si l'utilisateur n'a pas de propriété role", () => {
      mockReflector.getAllAndOverride.mockReturnValue(["CHEF"]);
      const context = createMockExecutionContext({
        id: '123',
        email: 'test@example.com',
      });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('Multiples rôles', () => {
    it('devrait autoriser USER pour une route [USER, ADMIN]', () => {
      mockReflector.getAllAndOverride.mockReturnValue(["MEMBER" as Role, "CHEF"]);
      const context = createMockExecutionContext({
        id: '123',
        role: "MEMBER" as Role,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('devrait autoriser ADMIN pour une route [USER, ADMIN]', () => {
      mockReflector.getAllAndOverride.mockReturnValue(["MEMBER" as Role, "CHEF"]);
      const context = createMockExecutionContext({
        id: '123',
        role: "CHEF",
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  describe('Reflector metadata', () => {
    it('devrait utiliser getAllAndOverride avec les bons arguments', () => {
      mockReflector.getAllAndOverride.mockReturnValue(["CHEF"]);
      const context = createMockExecutionContext({
        id: '123',
        role: "CHEF",
      });

      guard.canActivate(context);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('devrait chercher les métadonnées "roles"', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      const context = createMockExecutionContext({
        id: '123',
        role: "MEMBER" as Role,
      });

      guard.canActivate(context);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        'roles',
        expect.any(Array),
      );
    });
  });

  describe('Cas limites', () => {
    it("devrait gérer un rôle en string au lieu d'enum", () => {
      mockReflector.getAllAndOverride.mockReturnValue(['ADMIN']);
      const context = createMockExecutionContext({ id: '123', role: 'ADMIN' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('devrait être sensible à la casse pour les rôles', () => {
      mockReflector.getAllAndOverride.mockReturnValue(['ADMIN']);
      const context = createMockExecutionContext({ id: '123', role: 'admin' });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('devrait gérer undefined comme utilisateur', () => {
      mockReflector.getAllAndOverride.mockReturnValue(["CHEF"]);
      const context = createMockExecutionContext(undefined);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
