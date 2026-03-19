import { PrismaClient } from '@prisma/client'

export async function seedFamilies(prisma: PrismaClient) {
    // == Famille Martin (alice = CREATOR, bob = MEMBER)
    const familyMartin = await prisma.family.upsert({
        where: { id: 'family_martin' },
        update: {},
        create: {
            id: 'family_martin',
            name: 'Martin',
            familyMembers: {
                create: [
                    {
                        userId: 'user_alice',
                        role: 'CREATOR',
                    },
                    {
                        userId: 'user_bob',
                        role: 'MEMBER',
                    },
                ]
            }
        },
    })

    // == Famille Dupont (carol = CREATOR, dave = ADMIN)
    const familyDupont = await prisma.family.upsert({
        where: { id: 'family_dupont' },
        update: {},
        create: {
            id: 'family_dupont',
            name: 'Dupont',
            familyMembers: {
                create: [
                    {
                        userId: 'user_carol',
                        role: 'CREATOR',
                    },
                    {
                        userId: 'user_dave',
                        role: 'ADMIN',
                    },
                ]
            }
        },
    })

    console.log(`Families seeded: 2 (${familyMartin.name}, ${familyDupont.name})`)
    return { familyMartin, familyDupont }
}