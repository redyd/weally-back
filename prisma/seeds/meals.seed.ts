import { PrismaClient } from '@prisma/client'

export async function seedMeals(prisma: PrismaClient) {
    // == Repas famille Martin
    const meals = await Promise.all([
        prisma.meal.upsert({
            where: { id: 'meal_pasta' },
            update: {},
            create: {
                id: 'meal_pasta',
                label: 'Pâtes bolognaise',
                description: 'Pâtes avec sauce bolognaise maison',
                familyId: 'family_martin',
            },
        }),
        prisma.meal.upsert({
            where: { id: 'meal_salad' },
            update: {},
            create: {
                id: 'meal_salad',
                label: 'Salade César',
                description: null,
                familyId: 'family_martin',
            },
        }),
        prisma.meal.upsert({
            where: { id: 'meal_soup' },
            update: {},
            create: {
                id: 'meal_soup',
                label: 'Soupe de légumes',
                description: 'Soupe maison avec carottes, poireaux et pommes de terre',
                familyId: 'family_dupont',
            },
        }),
        prisma.meal.upsert({
            where: { id: 'meal_pizza' },
            update: {},
            create: {
                id: 'meal_pizza',
                label: 'Pizza maison',
                description: null,
                familyId: 'family_dupont',
            },
        }),
    ])

    console.log(`Meals seeded: ${meals.length}`)

    // == Plannings
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const plannings = await Promise.all([
        prisma.planning.upsert({
            where: { id: 'planning_1' },
            update: {},
            create: {
                id: 'planning_1',
                mealId: 'meal_pasta',
                type: 'DINNER',
                date: today,
            },
        }),
        prisma.planning.upsert({
            where: { id: 'planning_2' },
            update: {},
            create: {
                id: 'planning_2',
                mealId: 'meal_salad',
                type: 'LUNCH',
                date: today,
            },
        }),
        prisma.planning.upsert({
            where: { id: 'planning_3' },
            update: {},
            create: {
                id: 'planning_3',
                mealId: 'meal_soup',
                type: 'DINNER',
                date: tomorrow,
            },
        }),
        prisma.planning.upsert({
            where: { id: 'planning_4' },
            update: {},
            create: {
                id: 'planning_4',
                mealId: 'meal_pizza',
                type: 'LUNCH',
                date: tomorrow,
            },
        }),
    ])

    console.log(`Plannings seeded: ${plannings.length}`)
    return { meals, plannings }
}