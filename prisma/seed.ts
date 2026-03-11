import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { auth } from '../src/lib/auth';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // ─── Cleanup ─────────────────────────────────────────────────────────────────

    await prisma.meal.deleteMany();
    await prisma.family.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    // ─── Users ───────────────────────────────────────────────────────────────────

    const usersData = [
        { email: 'alice@example.com', firstName: 'Alice', lastName: 'Dupont',  password: 'Password123!' },
        { email: 'bob@example.com',   firstName: 'Bob',   lastName: 'Dupont',  password: 'Password123!' },
        { email: 'charlie@example.com', firstName: 'Charlie', lastName: 'Martin', password: 'Password123!' },
    ];

    const createdUsers: Record<string, string> = {}; // email → id

    for (const u of usersData) {
        const result = await auth.api.signUpEmail({
            body: {
                email: u.email,
                password: u.password,
                name: `${u.firstName} ${u.lastName}`,
            },
        });

        // Mettre à jour les champs custom non gérés par signUpEmail
        await prisma.user.update({
            where: { email: u.email },
            data: {
                emailVerified: true,
            },
        });

        createdUsers[u.email] = result.user.id;
    }

    const aliceId   = createdUsers['alice@example.com'];
    const bobId     = createdUsers['bob@example.com'];
    const charlieId = createdUsers['charlie@example.com'];

    console.log(`✅ Users: alice, bob, charlie`);

    // ─── Family ──────────────────────────────────────────────────────────────────

    const dupontFamily = await prisma.family.create({
        data: {
            id: 'seed-family-dupont',
            name: 'Dupont Family',
            creatorId: aliceId,
            members: {
                connect: [{ id: aliceId }, { id: bobId }],
            },
        },
    });

    console.log(`✅ Family: ${dupontFamily.name} (Alice + Bob)`);

    // ─── Meals ───────────────────────────────────────────────────────────────────

    const meals = [
        { id: 'seed-meal-1', label: 'Pasta Bolognese'    },
        { id: 'seed-meal-2', label: 'Caesar Salad'       },
        { id: 'seed-meal-3', label: 'Grilled Chicken'    },
        { id: 'seed-meal-4', label: 'Vegetable Stir Fry' },
        { id: 'seed-meal-5', label: 'Salmon with Rice'   },
    ];

    await prisma.meal.createMany({
        data: meals.map(m => ({ ...m, familyId: dupontFamily.id })),
    });

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