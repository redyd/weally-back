import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { JwtAuthGuard } from '../auth/jwt/JwtAuthGuard';
import { JoinFamilyDto } from './dto/join-family.dto';
import { CurrentUser } from '../auth/decorators/CurrentUser';
import { MemberClient } from './entities/member.entity';
import { FamilyClient } from './entities/family.entity';
import { AuthenticatedUser } from '../users/entities/UserTypes';

@UseGuards(JwtAuthGuard)
@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Post()
  create(@Body() createFamilyDto: CreateFamilyDto): Promise<FamilyClient> {
    return this.familyService.create(createFamilyDto);
  }

  @Post()
  join(
    @Body() joinFamilyDto: JoinFamilyDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MemberClient> {
    return this.familyService.joinFamily(joinFamilyDto, user.id);
  }
}
