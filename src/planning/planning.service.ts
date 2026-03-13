import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {PlannedMeal} from "../types/prisma.types";

@Injectable()
export class PlanningService {
    constructor(private prisma: PrismaService) {
    }

    async findForNextDays(familyId: string, days: number): Promise<PlannedMeal[]> {
        const today = new Date();
        const target = new Date();
        target.setDate(today.getDate() + days);

        return this.prisma.planning.findMany({
            where: {
                meal: {
                    familyId: familyId,
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
        })
    }

}
