import {
    Injectable,
    NotFoundException,
    ConflictException, GoneException,
} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateFamilyDto} from './dto/family.dto';
import {familySelect, FamilyWithMembers} from "../types/prisma.types";
import {Family, Invitation} from "../types/api.types";
import {nanoid} from "nanoid";

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

            return  await this.findById(family.id);
        });
    }

    /**
     * Should make the user join the family if the invitation is valid & the user does not belong to any families.
     *
     * @param code invitation code
     * @param userId
     */
    async join(code: string, userId: string): Promise<Family> {
        const user = await this.prisma.familyMember.findUnique({
            where: {userId: userId}
        });

        if (user) {
            throw new ConflictException('You already belong to a family');
        }

        // get invitation & usage count
        const invitation = await this.prisma.familyInvitation.findUnique({
            where: { code },
            include: {
                _count: {
                    select: {
                        uses: true
                    }
                }
            },
        })

        // usage guards
        if (!invitation) {
            throw new NotFoundException('This code is invalid');
        }

        if (invitation.expiresAt > new Date() || (invitation.maxUses && invitation.maxUses >= invitation._count.uses)) {
            throw new GoneException('This code is expired');
        }

        // create member & add invitation usage
        return this.prisma.$transaction(async (tx) => {
            await tx.familyMember.create({
                data: {
                    familyId: invitation.familyId,
                    userId: userId,
                    role: "MEMBER"
                }
            })

            await tx.familyInvitationUse.create({
                data: {
                    code: invitation.code,
                    usedBy: userId,
                }
            })

            return await this.findById(invitation.familyId);
        })
    }

    /**
     * Creates a new invitation that expires in 24 hours.
     *
     * @param userId
     * @param maxUses
     */
    async invite(userId: string, maxUses: number | null): Promise<Invitation> {
        const user = await this.prisma.familyMember.findUnique({
            where: {userId: userId},
        })

        if (!user) {
            throw new NotFoundException("You don't have any family");
        }

        // creates data
        const code = await this.generateUniqueCode();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        return this.prisma.familyInvitation.create({
            data: {
                familyId: user.familyId,
                maxUses: maxUses,
                code,
                expiresAt,
                createdBy: userId
            }
        });
    }

    /**
     * Find a family by ID.
     *
     * @param id
     */
    async findById(id: string): Promise<Family> {
        const family: FamilyWithMembers | null = await this.prisma.family.findUnique({
            where: {id},
            ...familySelect
        });

        if (!family) {
            throw new NotFoundException('Family not found');
        }

        return {
            ...family,
            createdAt: family.createdAt.toISOString(),
            updatedAt: family.updatedAt.toISOString(),
            familyMembers: family.familyMembers.map(({ role, user }) => ({
                role,
                name: user.name,
                image: user.image,
            })),
        }
    }

    async generateUniqueCode(): Promise<string> {
        let code: string
        let exists: boolean

        do {
            code = nanoid(8).toUpperCase()
            exists = !!(await this.prisma.familyInvitation.findUnique({
                where: { code },
            }))
        } while (exists)

        return code
    }
}