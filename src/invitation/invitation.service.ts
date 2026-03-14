import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class InvitationService {

    constructor(readonly prisma: PrismaService) {
    }

    async joinWithCode(code: string, userId: string) {
        const invitation = await this.prisma.familyInvitation.findUnique({
            where: { code },
            include: { uses: true },
        })

        if (!invitation) throw new NotFoundException('Invalid code')
        if (invitation.expiresAt < new Date()) throw new BadRequestException('Expired code')

        // Vérifier la limite d'utilisations
        if (invitation.maxUses !== null && invitation.uses.length >= invitation.maxUses) {
            throw new BadRequestException('This code reaches the maximum of usage')
        }

        // Vérifier que l'user n'est pas déjà membre
        const existing = await this.prisma.familyMember.findUnique({
            where: { familyId_userId: { userId, familyId: invitation.familyId } },
        })
        if (existing) throw new BadRequestException('You are already member of this family')

        // Transaction : enregistrer l'usage + ajouter le membre
        const [, member] = await this.prisma.$transaction([
            this.prisma.familyInvitationUse.create({
                data: { code, usedBy: userId },
            }),
            this.prisma.familyMember.create({
                data: { userId, familyId: invitation.familyId, role: 'MEMBER' },
            }),
        ])

        return member;
    }

}
