import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFamilyDto, UpdateFamilyDto } from './dto/family.dto';

@Injectable()
export class FamilyService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateFamilyDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user?.familyId) throw new ConflictException('You already belong to a family');

        return this.prisma.$transaction(async (tx) => {
            const family = await tx.family.create({
                data: { name: dto.name.trim(), creatorId: userId },
            });
            await tx.user.update({ where: { id: userId }, data: { familyId: family.id } });
            return this.findById(family.id);
        });
    }

    async join(userId: string, familyId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user?.familyId) throw new ConflictException('You already belong to a family');

        const family = await this.prisma.family.findUnique({ where: { id: familyId } });
        if (!family) throw new NotFoundException('Family not found');

        await this.prisma.user.update({ where: { id: userId }, data: { familyId } });
        return this.findById(familyId);
    }

    async leave(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { family: true },
        });

        if (!user?.familyId) throw new ConflictException('You do not belong to any family');

        if (user.family?.creatorId === userId) {
            throw new ForbiddenException('As creator, delete the family or transfer ownership first');
        }

        await this.prisma.user.update({ where: { id: userId }, data: { familyId: null } });
        return { message: 'You left the family' };
    }

    async findById(id: string) {
        const family = await this.prisma.family.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                members: { select: { id: true, name: true, email: true } },
            },
        });

        if (!family) throw new NotFoundException('Family not found');
        return family;
    }

    async update(userId: string, familyId: string, dto: UpdateFamilyDto) {
        const family = await this.prisma.family.findUnique({ where: { id: familyId } });
        if (!family) throw new NotFoundException('Family not found');
        if (family.creatorId !== userId) throw new ForbiddenException('Access denied');

        return this.prisma.family.update({
            where: { id: familyId },
            data: { name: dto.name?.trim() },
        });
    }

    async delete(userId: string, familyId: string) {
        const family = await this.prisma.family.findUnique({ where: { id: familyId } });
        if (!family) throw new NotFoundException('Family not found');
        if (family.creatorId !== userId) throw new ForbiddenException('Access denied');

        await this.prisma.family.delete({ where: { id: familyId } });
        return { message: 'Family deleted' };
    }
}