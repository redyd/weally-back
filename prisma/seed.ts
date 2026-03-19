import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seeds/users.seed'
import { seedFamilies } from './seeds/families.seed'
import { seedInvitations } from './seeds/invitations.seed'
import { seedMeals } from './seeds/meals.seed'
import {cleanDb} from "./seeds/cleanuip";

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...\n')

    await cleanDb(prisma)

    await seedUsers(prisma)
    await seedFamilies(prisma)
    await seedInvitations(prisma)
    await seedMeals(prisma)

    console.log('\n✅ Seed complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })