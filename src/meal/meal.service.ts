import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaWeallyService } from '../prisma-weally/prisma-weally.service';
import { CreateMealDto, UpdateMealDto } from './dto/meal.dto';

@Injectable()
export class MealService {
  constructor(private prisma: PrismaWeallyService) {}

  async findAll() {
    return this.prisma.meal.findMany({
      orderBy: { label: 'asc' },
    });
  }

  async findById(id: string) {
    const meal = await this.prisma.meal.findUnique({ where: { id } });
    if (!meal) throw new NotFoundException('Meal not found');
    return meal;
  }

  async create(dto: CreateMealDto) {
    return this.prisma.meal.create({
      data: { label: dto.label.trim() },
    });
  }

  async update(id: string, dto: UpdateMealDto) {
    await this.findById(id); // lève 404 si inexistant
    return this.prisma.meal.update({
      where: { id },
      data: { label: dto.label?.trim() },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.meal.delete({ where: { id } });
    return { message: 'Meal deleted' };
  }
}
