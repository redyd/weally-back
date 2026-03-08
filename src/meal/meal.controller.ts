import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto, UpdateMealDto } from './dto/meal.dto';

@Controller('meals')
export class MealController {
    constructor(private mealService: MealService) {}

    // GET /api/v1/meals
    @Get()
    findAll() {
        return this.mealService.findAll();
    }

    // GET /api/v1/meals/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.mealService.findById(id);
    }

    // POST /api/v1/meals
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateMealDto) {
        return this.mealService.create(dto);
    }

    // PATCH /api/v1/meals/:id
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateMealDto) {
        return this.mealService.update(id, dto);
    }

    // DELETE /api/v1/meals/:id
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    delete(@Param('id') id: string) {
        return this.mealService.delete(id);
    }
}