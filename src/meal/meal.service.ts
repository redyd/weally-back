import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateMealDto, UpdateMealDto} from './dto/meal.dto';
import {Confirmation, FamilyWithMeals, SafeMeal} from "../types/prisma.types";

@Injectable()
export class MealService {
    constructor(
        private prisma: PrismaService,
    ) {
    }

    private async assertUserInFamily(userId: string, familyId: string) {
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {familyId: true},
        });
        if (!user) throw new NotFoundException('User not found');
        if (user.familyId !== familyId) throw new ForbiddenException('You do not belong to this family');
    }

    async findAllByFamily(familyId: string): Promise<FamilyWithMeals> {
        return this.prisma.family.findUniqueOrThrow({
            where: {id: familyId},
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                creatorId: true,
                meals: true,
            },
        });
    }

    async findById(id: string): Promise<SafeMeal> {
        const meal: SafeMeal | null = await this.prisma.meal.findUnique({where: {id}});
        if (!meal) throw new NotFoundException('Meal not found');
        return meal;
    }

    async create(userId: string, dto: CreateMealDto): Promise<SafeMeal> {
        await this.assertUserInFamily(userId, dto.familyId);

        return this.prisma.meal.create({
            data: {
                label: dto.label.trim(),
                familyId: dto.familyId,
            },
        });
    }

    async update(userId: string, id: string, dto: UpdateMealDto): Promise<SafeMeal> {
        const meal = await this.findById(id);
        await this.assertUserInFamily(userId, meal.familyId);

        return this.prisma.meal.update({
            where: {id},
            data: {label: dto.label.trim()},
        });
    }

    async delete(userId: string, id: string): Promise<Confirmation> {
        const meal = await this.findById(id);
        await this.assertUserInFamily(userId, meal.familyId);

        await this.prisma.meal.delete({where: {id}});
        return {message: 'Meal deleted', status: 'ok'};
    }
}