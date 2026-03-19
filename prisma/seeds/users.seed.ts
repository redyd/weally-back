import { PrismaClient } from '@prisma/client'
import {auth} from "../../src/lib/auth";

export async function seedUsers(prisma: PrismaClient) {
    const ctx = await auth.$context
    const hashedPassword = await ctx.password.hash('Password123!')

    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'alice@example.com' },
            update: {},
            create: {
                id: 'user_alice',
                email: 'alice@example.com',
                name: 'Alice Martin',
                emailVerified: true,
                image: 'https://i.pravatar.cc/150?u=alice',
                accounts: {
                    create: {
                        accountId: 'alice@example.com',
                        providerId: 'credential',
                        password: hashedPassword,
                    }
                }
            },
        }),
        prisma.user.upsert({
            where: { email: 'bob@example.com' },
            update: {},
            create: {
                id: 'user_bob',
                email: 'bob@example.com',
                name: 'Bob Martin',
                emailVerified: true,
                image: 'https://i.pravatar.cc/150?u=bob',
                accounts: {
                    create: {
                        accountId: 'bob@example.com',
                        providerId: 'credential',
                        password: hashedPassword,
                    }
                }
            },
        }),
        prisma.user.upsert({
            where: { email: 'carol@example.com' },
            update: {},
            create: {
                id: 'user_carol',
                email: 'carol@example.com',
                name: 'Carol Dupont',
                emailVerified: false,
                image: null,
                accounts: {
                    create: {
                        accountId: 'carol@example.com',
                        providerId: 'credential',
                        password: hashedPassword,
                    }
                }
            },
        }),
        prisma.user.upsert({
            where: { email: 'dave@example.com' },
            update: {},
            create: {
                id: 'user_dave',
                email: 'dave@example.com',
                name: 'Dave Leroy',
                emailVerified: true,
                image: 'https://i.pravatar.cc/150?u=dave',
                accounts: {
                    create: {
                        accountId: 'dave@example.com',
                        providerId: 'google',
                        accessToken: 'google_access_token_dave',
                    }
                }
            },
        }),
    ])

    console.log(`✅ Users seeded: ${users.length}`)
    return users
}