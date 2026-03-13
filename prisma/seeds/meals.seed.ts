import { PrismaClient } from '@prisma/client';

export async function seedMeals(
    prisma: PrismaClient,
    familyId: string
) {
    const meals = [
        { id: 'seed-meal-1', label: 'Pasta Bolognese' },
        { id: 'seed-meal-2', label: 'Caesar Salad' },
        { id: 'seed-meal-3', label: 'Grilled Chicken' },
        { id: 'seed-meal-4', label: 'Vegetable Stir Fry' },
        { id: 'seed-meal-5', label: 'Salmon with Rice' },
    ];

    await prisma.meal.createMany({
        data: meals.map(m => ({
            ...m,
            familyId,
        })),
    });

    console.log('   Meals seeded');

    return meals.map(m => m.id);
}
