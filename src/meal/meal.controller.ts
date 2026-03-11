import {Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus} from '@nestjs/common';
import {Session} from '@thallesp/nestjs-better-auth';
import {MealService} from './meal.service';
import {CreateMealDto, UpdateMealDto} from './dto/meal.dto';
import type {UserSession} from '@thallesp/nestjs-better-auth';

@Controller('meals')
export class MealController {
    constructor(private mealService: MealService) {
    }

    @Get('family/:familyId')
    findByFamily(@Param('familyId') familyId: string) {
        return this.mealService.findAllByFamily(familyId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.mealService.findById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Session() session: UserSession, @Body() dto: CreateMealDto) {
        return this.mealService.create(session.user.id, dto);
    }

    @Patch(':id')
    update(
        @Session() session: UserSession,
        @Param('id') id: string,
        @Body() dto: UpdateMealDto,
    ) {
        return this.mealService.update(session.user.id, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    delete(@Session() session: UserSession, @Param('id') id: string) {
        return this.mealService.delete(session.user.id, id);
    }
}