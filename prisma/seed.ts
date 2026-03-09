import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'ù.env' });

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ─── Users ──────────────────────────────────────────────────────────────────

    const alice = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            email: 'alice@example.com',
            password: await bcrypt.hash('Password123!', 12),
            firstName: 'Alice',
            lastName: 'Dupont',
        },
    });

    const bob = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: {
            email: 'bob@example.com',
            password: await bcrypt.hash('Password123!', 12),
            firstName: 'Bob',
            lastName: 'Dupont',
        },
    });

    const charlie = await prisma.user.upsert({
        where: { email: 'charlie@example.com' },
        update: {},
        create: {
            email: 'charlie@example.com',
            password: await bcrypt.hash('Password123!', 12),
            firstName: 'Charlie',
            lastName: 'Martin',
        },
    });

    console.log(`✅ Users: ${alice.email}, ${bob.email}, ${charlie.email}`);

    // ─── Family ─────────────────────────────────────────────────────────────────

    const dupontFamily = await prisma.family.upsert({
        where: { id: 'seed-family-dupont' },
        update: {},
        create: {
            id: 'seed-family-dupont',
            name: 'Dupont Family',
            creatorId: alice.id,
        },
    });

    await prisma.user.update({ where: { id: alice.id }, data: { familyId: dupontFamily.id } });
    await prisma.user.update({ where: { id: bob.id }, data: { familyId: dupontFamily.id } });

    console.log(`✅ Family: ${dupontFamily.name} (Alice + Bob)`);

    // ─── Meals ──────────────────────────────────────────────────────────────────

    const meals = [
        { id: 'seed-meal-1', label: 'Pasta Bolognese',   familyId: dupontFamily.id },
        { id: 'seed-meal-2', label: 'Caesar Salad',       familyId: dupontFamily.id },
        { id: 'seed-meal-3', label: 'Grilled Chicken',    familyId: dupontFamily.id },
        { id: 'seed-meal-4', label: 'Vegetable Stir Fry', familyId: dupontFamily.id },
        { id: 'seed-meal-5', label: 'Salmon with Rice',   familyId: dupontFamily.id },
    ];

    for (const meal of meals) {
        await prisma.meal.upsert({
            where: { id: meal.id },
            update: {},
            create: meal,
        });
    }

    console.log(`✅ Meals: ${meals.length} repas pour la famille Dupont`);
    console.log('');
    console.log('🔑 Comptes de test:');
    console.log('   alice@example.com   / Password123!  (créatrice famille Dupont)');
    console.log('   bob@example.com     / Password123!  (membre famille Dupont)');
    console.log('   charlie@example.com / Password123!  (sans famille)');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());