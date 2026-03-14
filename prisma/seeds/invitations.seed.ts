import { PrismaClient } from '@prisma/client'

export async function seedInvitations(prisma: PrismaClient) {
    const now = new Date()

    // == Code actif, multi-usages, créé par alice pour la famille Martin
    const activeInvitation = await prisma.familyInvitation.upsert({
        where: { code: 'MARTIN01' },
        update: {},
        create: {
            code: 'MARTIN01',
            familyId: 'family_martin',
            createdBy: 'user_alice',
            expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // +24h
            maxUses: 5,
        },
    })

    // == Code expiré (pour tester le cas d'erreur)
    const expiredInvitation = await prisma.familyInvitation.upsert({
        where: { code: 'EXPIRED1' },
        update: {},
        create: {
            code: 'EXPIRED1',
            familyId: 'family_martin',
            createdBy: 'user_alice',
            expiresAt: new Date(now.getTime() - 60 * 1000), // déjà expiré
            maxUses: null,
        },
    })

    // == Code illimité créé par carol pour la famille Dupont
    const unlimitedInvitation = await prisma.familyInvitation.upsert({
        where: { code: 'DUPONT01' },
        update: {},
        create: {
            code: 'DUPONT01',
            familyId: 'family_dupont',
            createdBy: 'user_carol',
            expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 jours
            maxUses: null,
        },
    })

    // == Usage : bob a utilisé le code DUPONT01 pour rejoindre (simulé)
    const invitationUse = await prisma.familyInvitationUse.upsert({
        where: { code_usedBy: { code: 'DUPONT01', usedBy: 'user_bob' } },
        update: {},
        create: {
            code: 'DUPONT01',
            usedBy: 'user_bob',
        },
    })

    console.log(`Invitations seeded: 3 (actif: ${activeInvitation.code}, expiré: ${expiredInvitation.code}, illimité: ${unlimitedInvitation.code})`)
    console.log(`Invitation uses seeded: 1 (${invitationUse.id})`)

    return { activeInvitation, expiredInvitation, unlimitedInvitation, invitationUse }
}