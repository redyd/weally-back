import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/jwt/JwtAuthGuard';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../auth/decorators/CurrentUser';
import { UserClient } from '../users/entities/user.entity';
import { GetAllFoodResponseDto } from './dto/food-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @Throttle({ short: { ttl: 1000, limit: 2 } })
  getAll(
    @CurrentUser() user: UserClient,
    @Query('pageSize') pageSize: number = 15,
    @Query('page') page: number = 1,
  ): Promise<GetAllFoodResponseDto> {
    return this.foodService.getAll(user, pageSize, page);
  }
}
