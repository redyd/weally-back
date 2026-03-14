import {PrismaClient} from '@prisma/client';
import * as dotenv from 'dotenv';
import {cleanup} from "./seeds/cleanuip";
import {seedUsers} from "./seeds/users.seed";
import {seedFamilies} from "./seeds/families.seed";
import {seedMeals} from "./seeds/meals.seed";
import {seedPlannings} from "./seeds/planning.seed";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...\n');

    await cleanup(prisma);

    const users = await seedUsers(prisma);

    const {dupontFamilyId} = await seedFamilies(prisma);

    const mealIds = await seedMeals(prisma, dupontFamilyId);

    await seedPlannings(prisma, mealIds);

    console.log('\nComptes de test:');
    console.log('alice@example.com   / Password123!');
    console.log('bob@example.com     / Password123!');
    console.log('charlie@example.com / Password123!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
