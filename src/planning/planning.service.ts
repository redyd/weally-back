import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {MealsPerDay} from "../types/prisma.types";

@Injectable()
export class PlanningService {
    constructor(private prisma: PrismaService) {
    }

    async findForNextDays(familyId: string, days: number): Promise<MealsPerDay[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const target = new Date(today);
        target.setDate(today.getDate() + days);

        const planning = await this.prisma.planning.findMany({
            where: {
                meal: { familyId },
                date: { gte: today, lt: target },
            },
            select: {
                date: true,
                type: true,
                meal: {
                    select: {
                        id: true,
                        label: true,
                        description: true,
                    },
                },
            },
        });

        // Grouper par date (plusieurs meals par jour possibles)
        const index = new Map<string, typeof planning>();

        for (const p of planning) {
            const key = p.date.toISOString().slice(0, 10);
            if (!index.has(key)) index.set(key, []);
            index.get(key)!.push(p);
        }

        return Array.from({ length: days }, (_, i) => {
            const day = new Date(today);
            day.setDate(today.getDate() + i);

            const key = day.toISOString().slice(0, 10);
            const entries = index.get(key) ?? [];

            return {
                day,
                meals: entries.map(e => ({
                    id: e.meal.id,
                    label: e.meal.label,
                    description: e.meal.description,
                    type: e.type,
                })),
            };
        });
    }


}
