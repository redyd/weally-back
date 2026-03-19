import { PrismaClient } from '@prisma/client';

export async function cleanDb(prisma: PrismaClient) {
    // L'ordre est important — supprimer d'abord les tables enfants
    await prisma.planning.deleteMany()
    await prisma.meal.deleteMany()
    await prisma.familyInvitationUse.deleteMany()
    await prisma.familyInvitation.deleteMany()
    await prisma.familyMember.deleteMany()
    await prisma.family.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Database cleaned')
}