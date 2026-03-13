import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {UserWithFamily} from "../types/prisma.types";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {
    }

    async findById(id: string): Promise<UserWithFamily> {
        const user = await this.prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                image: true,
                familyId: true,
                createdAt: true,
                updatedAt: true,
                family: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                        creatorId: true,
                    }
                },
            },
        });

        if (!user) throw new NotFoundException('Utilisateur introuvable');
        return user;
    }
}