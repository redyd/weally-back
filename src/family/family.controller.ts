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
import { FamilyService } from './family.service';
import { CreateFamilyDto, UpdateFamilyDto, JoinFamilyDto } from './dto/family.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('familles')
export class FamilyController {
    constructor(private familleService: FamilyService) {}

    // POST /api/v1/familles
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateFamilyDto,
    ) {
        return this.familleService.create(userId, dto);
    }

    // POST /api/v1/familles/join
    @Post('join')
    @HttpCode(HttpStatus.OK)
    join(
        @CurrentUser('id') userId: string,
        @Body() dto: JoinFamilyDto,
    ) {
        return this.familleService.join(userId, dto.familyId);
    }

    // POST /api/v1/familles/leave
    @Post('leave')
    @HttpCode(HttpStatus.OK)
    leave(@CurrentUser('id') userId: string) {
        return this.familleService.leave(userId);
    }

    // GET /api/v1/familles/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.familleService.findById(id);
    }

    // PATCH /api/v1/familles/:id
    @Patch(':id')
    update(
        @CurrentUser('id') userId: string,
        @Param('id') familleId: string,
        @Body() dto: UpdateFamilyDto,
    ) {
        return this.familleService.update(userId, familleId, dto);
    }

    // DELETE /api/v1/familles/:id
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    delete(
        @CurrentUser('id') userId: string,
        @Param('id') familleId: string,
    ) {
        return this.familleService.delete(userId, familleId);
    }
}