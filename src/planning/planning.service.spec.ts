import { Test, TestingModule } from '@nestjs/testing';
import { PlanningService } from './planning.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  planning: {
    findMany: jest.fn(),
  },
};

describe('PlanningService', () => {
  let service: PlanningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanningService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PlanningService>(PlanningService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findForNextDays', () => {
    const userId = 'user-123';
    const days = 7;

    const mockPlannedMeals = [
      {
        id: 'planning-1',
        type: 'LUNCH',
        date: new Date(),
        meal: { id: 'meal-1', label: 'Pasta', description: 'Délicieux' },
      },
      {
        id: 'planning-2',
        type: 'DINNER',
        date: new Date(),
        meal: { id: 'meal-2', label: 'Pizza', description: null },
      },
    ];

    it('appelle prisma.planning.findMany avec les bons paramètres', async () => {
      mockPrismaService.planning.findMany.mockResolvedValue(mockPlannedMeals);

      await service.findForNextDays(userId, days);

      expect(mockPrismaService.planning.findMany).toHaveBeenCalledWith({
        where: {
          meal: {
            family: {
              members: {
                some: { id: userId },
              },
            },
          },
        },
        select: {
          id: true,
          type: true,
          date: true,
          meal: {
            select: {
              id: true,
              label: true,
              description: true,
            },
          },
        },
      });
    });

    it('retourne les plannings trouvés', async () => {
      mockPrismaService.planning.findMany.mockResolvedValue(mockPlannedMeals);

      const result = await service.findForNextDays(userId, days);

      expect(result).toEqual(mockPlannedMeals);
      expect(result).toHaveLength(2);
    });

    it('retourne un tableau vide si aucun planning trouvé', async () => {
      mockPrismaService.planning.findMany.mockResolvedValue([]);

      const result = await service.findForNextDays(userId, days);

      expect(result).toEqual([]);
    });

    it('propage une erreur si prisma échoue', async () => {
      mockPrismaService.planning.findMany.mockRejectedValue(
          new Error('DB error'),
      );

      await expect(service.findForNextDays(userId, days)).rejects.toThrow(
          'DB error',
      );
    });
  });
});