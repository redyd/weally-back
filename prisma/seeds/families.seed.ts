import { PrismaClient } from '@prisma/client';

export async function seedFamilies(
    prisma: PrismaClient,
    users: { aliceId: string; bobId: string }
) {
    const dupontFamily = await prisma.family.create({
        data: {
            id: 'seed-family-dupont',
            name: 'Dupont Family',
            creatorId: users.aliceId,
            members: {
                connect: [{ id: users.aliceId }, { id: users.bobId }],
            },
        },
    });

    console.log('   Family seeded');

    return {
        dupontFamilyId: dupontFamily.id,
    };
}
