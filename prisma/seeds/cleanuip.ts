import { PrismaClient } from '@prisma/client';

export async function cleanup(prisma: PrismaClient) {
    await prisma.planning.deleteMany();
    await prisma.meal.deleteMany();
    await prisma.family.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
}