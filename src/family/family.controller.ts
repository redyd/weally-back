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

@Controller('family')
export class FamilyController {
    constructor(private familleService: FamilyService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Session() session: UserSession, @Body() dto: CreateFamilyDto): Promise<Family> {
        return this.familleService.create(session.user.id, dto);
    }

    @Post(':familyId')
    @HttpCode(HttpStatus.OK)
    join(@Session() session: UserSession, @Param('familyId') familyId: string) {

    }
}
