import { PrismaClient } from '../../src/generated/weally';

const prisma = new PrismaClient({
    datasources: {
        db: { url: process.env.DATABASE_URL_WEALLY },
    },
});

async function main() {
    console.log('🌱 Seeding weally schema...');

    const meals = [
        { id: 'seed-meal-1', label: 'Pasta Bolognese' },
        { id: 'seed-meal-2', label: 'Caesar Salad' },
        { id: 'seed-meal-3', label: 'Grilled Chicken' },
        { id: 'seed-meal-4', label: 'Vegetable Stir Fry' },
        { id: 'seed-meal-5', label: 'Salmon with Rice' },
    ];

    for (const meal of meals) {
        await prisma.meal.upsert({
            where: { id: meal.id },
            update: {},
            create: meal,
        });
    }

    console.log(`✅ ${meals.length} meals seeded`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());