import {PrismaClient} from '@prisma/client';
import * as dotenv from 'dotenv';
import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${hash.toString('hex')}`;
}

async function main() {
    console.log('Seeding database...');

    // ─── Users + Accounts ───────────────────────────────────────────────────────

    const usersData = [
        {email: 'alice@example.com', firstName: 'Alice', lastName: 'Dupont', password: 'Password123!'},
        {email: 'bob@example.com', firstName: 'Bob', lastName: 'Dupont', password: 'Password123!'},
        {email: 'charlie@example.com', firstName: 'Charlie', lastName: 'Martin', password: 'Password123!'},
    ];

    const createdUsers: Record<string, { id: string; email: string }> = {};

    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: {email: u.email},
            update: {},
            create: {
                email: u.email,
                name: `${u.firstName} ${u.lastName}`,
                emailVerified: true,
            },
        });

        // Créer l'Account credential BetterAuth si pas encore présent
        const existingAccount = await prisma.account.findFirst({
            where: {userId: user.id, providerId: 'credential'},
        });

        if (!existingAccount) {
            await prisma.account.create({
                data: {
                    accountId: user.id,
                    providerId: 'credential',
                    userId: user.id,
                    password: await hashPassword(u.password),
                },
            });
        }

        createdUsers[u.email] = user;
    }

    const alice = createdUsers['alice@example.com'];
    const bob = createdUsers['bob@example.com'];
    const charlie = createdUsers['charlie@example.com'];

    console.log(`✅ Users: ${alice.email}, ${bob.email}, ${charlie.email}`);

    // ─── Family ─────────────────────────────────────────────────────────────────

    const dupontFamily = await prisma.family.upsert({
        where: {id: 'seed-family-dupont'},
        update: {},
        create: {
            id: 'seed-family-dupont',
            name: 'Dupont Family',
            creatorId: alice.id,
        },
    });

    await prisma.user.update({where: {id: alice.id}, data: {familyId: dupontFamily.id}});
    await prisma.user.update({where: {id: bob.id}, data: {familyId: dupontFamily.id}});

    console.log(`✅ Family: ${dupontFamily.name} (Alice + Bob)`);

    // ─── Meals ──────────────────────────────────────────────────────────────────

    const meals = [
        {id: 'seed-meal-1', label: 'Pasta Bolognese', familyId: dupontFamily.id},
        {id: 'seed-meal-2', label: 'Caesar Salad', familyId: dupontFamily.id},
        {id: 'seed-meal-3', label: 'Grilled Chicken', familyId: dupontFamily.id},
        {id: 'seed-meal-4', label: 'Vegetable Stir Fry', familyId: dupontFamily.id},
        {id: 'seed-meal-5', label: 'Salmon with Rice', familyId: dupontFamily.id},
    ];

    for (const meal of meals) {
        await prisma.meal.upsert({where: {id: meal.id}, update: {}, create: meal});
    }

    console.log(`✅ Meals: ${meals.length} repas pour la famille Dupont`);
    console.log('');
    console.log('🔑 Comptes de test:');
    console.log('   alice@example.com   / Password123!  (créatrice famille Dupont)');
    console.log('   bob@example.com     / Password123!  (membre famille Dupont)');
    console.log('   charlie@example.com / Password123!  (sans famille)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());