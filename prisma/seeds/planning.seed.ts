import { PrismaClient, MealType } from '@prisma/client';

export async function seedPlannings(
    prisma: PrismaClient,
    mealIds: string[]
) {
    await prisma.planning.createMany({
        data: [
            {
                mealId: mealIds[0],
                type: MealType.DINNER,
                date: new Date(),
            },
            {
                mealId: mealIds[1],
                type: MealType.LUNCH,
                date: new Date(),
            },
            {
                mealId: mealIds[2],
                type: MealType.DINNER,
                date: new Date(Date.now() + 86400000),
            },
        ],
    });

    console.log('   Plannings seeded');
}
