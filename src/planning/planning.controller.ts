import {BadRequestException, Controller, Get, Param, ParseIntPipe, Query} from '@nestjs/common';
import {PlanningService} from './planning.service';
import {PlannedMeal} from "../types/prisma.types";
import {PinoLogger} from "nestjs-pino";

@Controller('planning')
export class PlanningController {
    constructor(private readonly planningService: PlanningService,
                private readonly logger: PinoLogger) {
    }

    @Get('future/:family')
    getPlanningForNextDays(
        @Param('family') familyId: string,
        @Query('days', ParseIntPipe) days: number,
    ): Promise<PlannedMeal[]> {

        if (days <= 0) {
            throw new BadRequestException('Days must be greater than 0');
        }

        this.logger.info(`Getting planning for the next ${days} days`);

        return this.planningService.findForNextDays(familyId, days);
    }


}
