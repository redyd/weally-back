import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateFamilyDto} from './dto/family.dto';
import {familySelect, FamilyWithMembers} from "../types/prisma.types";
import {Family} from "../types/api.types";

@Injectable()
export class FamilyService {
    constructor(private prisma: PrismaService) {
    }

    /**
     * Creates a new family and initialize it with the current user as CREATOR.
     * But, the user should not have an existing family.
     *
     * @param userId
     * @param dto
     */
    async create(userId: string, dto: CreateFamilyDto): Promise<Family> {
        // check if user has a family
        const user = await this.prisma.familyMember.findUnique({
            where: {userId: userId}
        });

        if (user) {
            throw new ConflictException('You already belong to a family');
        }

        // create a new family, and put the user as CREATOR
        return this.prisma.$transaction(async (tx) => {
            // create the family
            const family = await tx.family.create({
                data: {
                    name: dto.name.trim(),
                },
            });

            // put the user as CREATOR in the family
            await tx.familyMember.create({
                data: {
                    familyId: family.id,
                    userId: userId,
                    role: "CREATOR"
                }
            })

            const result: FamilyWithMembers = await this.findById(family.id);

            return {
                ...result,
                createdAt: result.createdAt.toISOString(),
                updatedAt: result.updatedAt.toISOString(),
                familyMembers: result.familyMembers.map(({ role, user }) => ({
                    role,
                    name: user.name,
                    image: user.image,
                })),
            }
        });
    }

    async join()

    /**
     * Find a family by ID.
     *
     * @param id
     */
    async findById(id: string): Promise<FamilyWithMembers> {
        const family: FamilyWithMembers | null = await this.prisma.family.findUnique({
            where: {id},
            ...familySelect
        });

        if (!family) {
            throw new NotFoundException('Family not found');
        }

        return family;
    }
}