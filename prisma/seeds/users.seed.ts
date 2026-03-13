import { PrismaClient } from '@prisma/client';
import { auth } from '../../src/lib/auth';

export async function seedUsers(prisma: PrismaClient) {
    const usersData = [
        { email: 'alice@example.com', firstName: 'Alice', lastName: 'Dupont', password: 'Password123!' },
        { email: 'bob@example.com', firstName: 'Bob', lastName: 'Dupont', password: 'Password123!' },
        { email: 'charlie@example.com', firstName: 'Charlie', lastName: 'Martin', password: 'Password123!' },
    ];

    const createdUsers: Record<string, string> = {};

    for (const u of usersData) {
        const result = await auth.api.signUpEmail({
            body: {
                email: u.email,
                password: u.password,
                name: `${u.firstName} ${u.lastName}`,
            },
        });

        await prisma.user.update({
            where: { email: u.email },
            data: {
                emailVerified: true,
            },
        });

        createdUsers[u.email] = result.user.id;
    }

    console.log('   Users seeded');

    return {
        aliceId: createdUsers['alice@example.com'],
        bobId: createdUsers['bob@example.com'],
        charlieId: createdUsers['charlie@example.com'],
    };
}
