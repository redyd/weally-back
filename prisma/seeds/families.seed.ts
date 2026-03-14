import { PrismaClient } from '@prisma/client';

export async function seedFamilies(
    prisma: PrismaClient
) {
    const dupontFamily = await prisma.family.create({
        data: {
            id: 'seed-family-dupont',
            name: 'Dupont Family'
        },
    });

    console.log('   Family seeded');

    return {
        dupontFamilyId: dupontFamily.id,
    };
}
