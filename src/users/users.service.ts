import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaAuthService } from '../prisma-auth/prisma-auth.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaAuthService) {}

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                familyId: true,
                family: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!user) throw new NotFoundException('Utilisateur introuvable');
        return user;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }
}