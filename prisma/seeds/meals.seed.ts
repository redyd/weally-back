import {PrismaClient} from '@prisma/client';

export async function seedMeals(
    prisma: PrismaClient,
    familyId: string
) {
    const meals = [
        {
            id: 'seed-meal-1',
            label: 'Pâtes Bolognaise',
            description: 'Pâtes fraîches avec une sauce bolognaise mijotée à la tomate et au bœuf haché'
        },
        {
            id: 'seed-meal-2',
            label: 'Salade César',
        },
        {
            id: 'seed-meal-3',
            label: 'Poulet Grillé',
            description: 'Filet de poulet mariné aux herbes de Provence, grillé et servi avec des légumes'
        },
        {
            id: 'seed-meal-4',
            label: 'Wok de Légumes',
            description: 'Légumes de saison sautés au wok avec une sauce soja et du gingembre frais'
        },
        {
            id: 'seed-meal-5',
            label: 'Saumon au Riz Basmati',
            description: 'Pavé de saumon grillé au citron, accompagné de riz basmati et de brocolis vapeur'
        },
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
