import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { DatabaseService } from '../database/database.service';
import { FamilyClient } from './entities/family.entity';
import { JoinFamilyDto } from './dto/join-family.dto';
import { MemberClient } from './entities/member.entity';
import { UserClient } from '../users/entities/user.entity';

@Injectable()
export class FamilyService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger = new Logger('FamilyService');

  /**
   * Crée une nouvelle famille.
   *
   * @param createFamilyDto
   */
  async create(createFamilyDto: CreateFamilyDto): Promise<FamilyClient> {
    this.logger.log(`Creating new family with name: ${createFamilyDto.name}`);
    const plainFamily = await this.databaseService.family
      .create({
        data: createFamilyDto,
      })
      .catch((err) => {
        this.logger.error(`Failed to create family: ${err}`);
        throw new InternalServerErrorException();
      });
    return new FamilyClient(plainFamily);
  }

  /**
   * Fait rejoindre un utilisateur à une famille sur base des ID en tant que membre
   *
   * @param joinFamilyDto l'id de la famille
   * @param user l'id de l'utilisateur
   */
  async joinFamily(
    joinFamilyDto: JoinFamilyDto,
    user: UserClient,
  ): Promise<MemberClient> {
    this.logger.log(
      `User ${user.email} is trying to join family with id: ${joinFamilyDto.id}`,
    );
    const result = await this.databaseService
      .$transaction(async (prisma) => {
        await prisma.member.deleteMany({ where: { userId: user.id } });

        return prisma.member.create({
          data: {
            userId: user.id,
            familyId: joinFamilyDto.id,
            role: 'MEMBER',
          },
        });
      })
      .catch((err) => {
        this.logger.error(`Failed to join family: ${err}`);
        throw new InternalServerErrorException();
      });

    this.logger.log(`User ${user.email} has joined family ${joinFamilyDto.id}`);
    return new MemberClient(result);
  }

  async createAndJoin(
    createFamilyDto: CreateFamilyDto,
    user: UserClient,
  ): Promise<{ family: FamilyClient; member: MemberClient }> {
    this.logger.log(
      `User ${user.email} is trying to create its own family with name ${createFamilyDto.name}`,
    );
    return this.databaseService
      .$transaction(async (prisma) => {
        // 1. Créer la famille
        const family = await prisma.family.create({
          data: createFamilyDto,
        });

        // 2. Retirer l'utilisateur de son ancienne famille
        await prisma.member.deleteMany({
          where: { userId: user.id },
        });

        // 3. Ajouter l'utilisateur à la nouvelle famille en tant que chef
        const member = await prisma.member.create({
          data: {
            userId: user.id,
            familyId: family.id,
            role: 'CHEF',
          },
        });

        this.logger.log(
          `User ${user.email} has successfully creates its own family with name ${createFamilyDto.name}`,
        );

        return {
          family: new FamilyClient(family),
          member: new MemberClient(member),
        };
      })
      .catch((err) => {
        this.logger.error(`Failed to create and join a family: ${err}`);
        throw new InternalServerErrorException();
      });
  }
}
