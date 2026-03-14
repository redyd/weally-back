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
import {Family} from "../types/api.types";
import {InviteToFamilyDto} from "./dto/invitation.dt";
import {PinoLogger} from "nestjs-pino";

@Controller('family')
export class FamilyController {
    constructor(private familleService: FamilyService, private readonly logger: PinoLogger) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Session() session: UserSession, @Body() dto: CreateFamilyDto): Promise<Family> {
        return this.familleService.create(session.user.id, dto);
    }

    @Post('invite')
    @HttpCode(HttpStatus.CREATED)
    invite(@Session() session: UserSession, @Body() dto: InviteToFamilyDto) {
        this.logger.debug('Invite Invite');
        return this.familleService.invite(session.user.id, dto.maxUses);
    }

    @Post('join/:code')
    @HttpCode(HttpStatus.OK)
    join(@Session() session: UserSession, @Param('code') code: string): Promise<Family> {
        return this.familleService.join(code, session.user.id);
    }
}
