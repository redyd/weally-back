import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { JwtAuthGuard } from '../auth/jwt/JwtAuthGuard';
import { JoinFamilyDto } from './dto/join-family.dto';
import { CurrentUser } from '../auth/decorators/CurrentUser';
import { MemberClient } from './entities/member.entity';
import { FamilyClient } from './entities/family.entity';
import { UserClient } from '../users/entities/user.entity';
import { Throttle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard)
@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  /**
   * Crée une nouvelle famille et rejoint en tant que chef.
   *
   * @param createFamilyDto la nouvelle famille
   * @param currentUser
   */
  @Post('create-join')
  @Throttle({ short: { ttl: 2000, limit: 1 } })
  createAndJoin(
    @Body() createFamilyDto: CreateFamilyDto,
    @CurrentUser() currentUser: UserClient,
  ): Promise<{ family: FamilyClient; member: MemberClient }> {
    return this.familyService.createAndJoin(createFamilyDto, currentUser.id);
  }

  /**
   * Permet de créer une nouvelle famille (sans membre).
   *
   * @param createFamilyDto la nouvelle famille
   */
  @Post('create')
  @Throttle({ short: { ttl: 2000, limit: 1 } })
  create(@Body() createFamilyDto: CreateFamilyDto): Promise<FamilyClient> {
    return this.familyService.create(createFamilyDto);
  }

  /**
   * Permet de rejoindre une nouvelle famille (en quittant l'ancienne si présente)
   * en tant que membre.
   *
   * @param joinFamilyDto l'id de la famille
   * @param user
   */
  @Post('join')
  @Throttle({ short: { ttl: 1000, limit: 2 } })
  join(
    @Body() joinFamilyDto: JoinFamilyDto,
    @CurrentUser() user: UserClient,
  ): Promise<MemberClient> {
    return this.familyService.joinFamily(joinFamilyDto, user.id);
  }
}
