import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UserClient } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { GetAllFoodResponseDto } from './dto/food-response.dto';

@Injectable()
export class FoodService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger = new Logger('FoodService');

  /**
   * Récupère tous les aliments d'une famille avec un système de pagination.
   *
   * @param user
   * @param pageSize
   * @param page
   */
  async getAll(
    user: UserClient,
    pageSize: number,
    page: number,
  ): Promise<GetAllFoodResponseDto> {
    this.logger.log(`Fetching all food for user ${user.email}`);

    if (!user.familyId) {
      this.logger.log(`User ${user.email} doesn't have a family`);
      throw new UnauthorizedException("You don't have any family");
    }

    const [foodsRaw, totalCount] = await Promise.all([
      this.databaseService.food
        .findMany({
          where: {
            foodFamilies: {
              some: {
                familyId: user.familyId,
              },
            },
          },
          include: {
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
            allergenes: {
              include: {
                allergene: true,
              },
            },
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
        })
        .catch((err) => {
          this.logger.error(
            `Error while fetching food for user ${user.email}: ${err}`,
          );
          throw new InternalServerErrorException(
            'Error while fetching food for user',
          );
        }),
      this.databaseService.food
        .count({
          where: {
            foodFamilies: {
              some: {
                familyId: user.familyId,
              },
            },
          },
        })
        .catch((err) => {
          this.logger.error(
            `Error while counting food for user ${user.email}: ${err}`,
          );
          throw new InternalServerErrorException(
            'Error while counting food for user',
          );
        }),
    ]);

    const foods = foodsRaw.map((food) => ({
      ...food,
      tags: food.tags.map((ft) => ft.tag),
      allergenes: food.allergenes.map((fa) => fa.allergene),
    }));

    const response = {
      data: foods,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };

    return plainToInstance(GetAllFoodResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }
}
