import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {Session} from '@thallesp/nestjs-better-auth';
import type {UserSession} from '@thallesp/nestjs-better-auth';
import {FamilyService} from './family.service';
import {
    CreateFamilyDto,
    UpdateFamilyDto,
    JoinFamilyDto,
} from './dto/family.dto';
import {Confirmation, FamilyWithMembers, SafeFamily} from "../types/prisma.types";

@Controller('family')
export class FamilyController {
    constructor(private familleService: FamilyService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Session() session: UserSession, @Body() dto: CreateFamilyDto): Promise<SafeFamily> {
        return this.familleService.create(session.user.id, dto);
    }

    @Post('join')
    @HttpCode(HttpStatus.OK)
    join(@Session() session: UserSession, @Body() dto: JoinFamilyDto): Promise<SafeFamily> {
        return this.familleService.join(session.user.id, dto.familyId);
    }

    @Post('leave')
    @HttpCode(HttpStatus.OK)
    leave(@Session() session: UserSession): Promise<Confirmation> {
        return this.familleService.leave(session.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<FamilyWithMembers> {
        return this.familleService.findById(id);
    }

    @Patch(':id')
    update(
        @Session() session: UserSession,
        @Param('id') familleId: string,
        @Body() dto: UpdateFamilyDto,
    ): Promise<SafeFamily> {
        return this.familleService.update(session.user.id, familleId, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    delete(@Session() session: UserSession, @Param('id') familleId: string): Promise<Confirmation> {
        return this.familleService.delete(session.user.id, familleId);
    }
}
