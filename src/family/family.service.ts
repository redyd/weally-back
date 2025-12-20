import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { DatabaseService } from '../database/database.service';
import { FamilyClient } from './entities/family.entity';
import { JoinFamilyDto } from './dto/join-family.dto';
import { MemberClient } from './entities/member.entity';

@Injectable()
export class FamilyService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Crée une nouvelle famille.
   *
   * @param createFamilyDto
   */
  async create(createFamilyDto: CreateFamilyDto): Promise<FamilyClient> {
    const plainFamily = await this.databaseService.family.create({
      data: createFamilyDto,
    });
    return new FamilyClient(plainFamily);
  }

  /**
   * Fait rejoindre un utilisateur à une famille sur base des ID en tant que membre
   *
   * @param joinFamilyDto l'id de la famille
   * @param userId l'id de l'utilisateur
   */
  async joinFamily(
    joinFamilyDto: JoinFamilyDto,
    userId: number,
  ): Promise<MemberClient> {
    const result = await this.databaseService.$transaction(async (prisma) => {
      await prisma.member.deleteMany({ where: { userId } });

      return prisma.member.create({
        data: {
          userId,
          familyId: joinFamilyDto.newFamilyId,
          role: 'MEMBER',
        },
      });
    });

    return new MemberClient(result);
  }

  async createAndJoin(
    createFamilyDto: CreateFamilyDto,
    userId: number,
  ): Promise<{ family: FamilyClient; member: MemberClient }> {
    return this.databaseService.$transaction(async (prisma) => {
      // 1. Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // 2. Créer la famille
      const family = await prisma.family.create({
        data: createFamilyDto,
      });

      // 3. Retirer l'utilisateur de son ancienne famille
      await prisma.member.deleteMany({
        where: { userId },
      });

      // 4. Ajouter l'utilisateur à la nouvelle famille en tant que chef
      const member = await prisma.member.create({
        data: {
          userId,
          familyId: family.id,
          role: 'CHEF',
        },
      });

      return {
        family: new FamilyClient(family),
        member: new MemberClient(member),
      };
    });
  }
}
