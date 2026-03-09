import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto, UpdateMealDto } from './dto/meal.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('meals')
export class MealController {
    constructor(private mealService: MealService) {}

    // GET /api/v1/meals/family/:familyId
    @Get('family/:familyId')
    findByFamily(@Param('familyId') familyId: string) {
        return this.mealService.findAllByFamily(familyId);
    }

    // GET /api/v1/meals/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.mealService.findById(id);
    }

    // POST /api/v1/meals
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@CurrentUser('id') userId: string, @Body() dto: CreateMealDto) {
        return this.mealService.create(userId, dto);
    }

    // PATCH /api/v1/meals/:id
    @Patch(':id')
    update(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateMealDto,
    ) {
        return this.mealService.update(userId, id, dto);
    }

    // DELETE /api/v1/meals/:id
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.mealService.delete(userId, id);
    }
}
