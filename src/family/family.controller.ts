import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus, Param,
} from '@nestjs/common';
import {Session} from '@thallesp/nestjs-better-auth';
import type {UserSession} from '@thallesp/nestjs-better-auth';
import {FamilyService} from './family.service';
import {
    CreateFamilyDto,
} from './dto/family.dto';
import {Confirmation, Family} from "../types/api.types";
import {InviteToFamilyDto} from "./dto/invitation.dt";

@Controller('family')
export class FamilyController {
    constructor(private familyService: FamilyService) {
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    create(@Session() session: UserSession, @Body() dto: CreateFamilyDto): Promise<Family> {
        return this.familyService.create(session.user.id, dto);
    }

    @Post('leave')
    @HttpCode(HttpStatus.OK)
    leave(@Session() session: UserSession): Promise<Confirmation> {
        return this.familyService.leave(session.user.id);
    }

    @Post('invite')
    @HttpCode(HttpStatus.CREATED)
    invite(@Session() session: UserSession, @Body() dto: InviteToFamilyDto) {
        return this.familyService.invite(session.user.id, dto.maxUses);
    }

    @Post('join/:code')
    @HttpCode(HttpStatus.OK)
    join(@Session() session: UserSession, @Param('code') code: string): Promise<Family> {
        return this.familyService.join(code, session.user.id);
    }
}
