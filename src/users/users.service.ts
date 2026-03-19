import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {User} from "../types/api.types";
import {UserAndFamilyWithMembers, userFamilySelect} from "../types/prisma.types";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {
    }

    async findById(id: string): Promise<User> {
        const user: UserAndFamilyWithMembers | null = await this.prisma.user.findUnique({
            where: { id },
            ...userFamilySelect
        })

        if (!user) throw new NotFoundException('User not found')

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified,
            image: user.image,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            family: user.family ? {
                id: user.family.family.id,
                name: user.family.family.name,
                createdAt: user.family.family.createdAt.toISOString(),
                updatedAt: user.family.family.updatedAt.toISOString(),
                familyMembers: user.family.family.familyMembers.map(({ role, user: u }) => ({
                    role,
                    id: u.id,
                    name: u.name,
                    image: u.image,
                }))
            } : null
        }
    }
}