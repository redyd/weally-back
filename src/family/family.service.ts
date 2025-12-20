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
   * Fait rejoindre un utilisateur à une famille sur base des ID.
   *
   * @param joinFamilyDto l'id de la famille
   * @param userId l'id de l'utilisateur
   */
  async joinFamily(
    joinFamilyDto: JoinFamilyDto,
    userId: number,
  ): Promise<MemberClient> {
    // delete where user is
    this.databaseService.member.delete({ where: { userId: userId } });

    // join the new family as member
    const newFamilyPlain = await this.databaseService.member.create({
      data: {
        userId: userId,
        familyId: joinFamilyDto.newFamilyId,
        role: 'MEMBER',
      },
    });

    return new MemberClient(newFamilyPlain);
  }
}
