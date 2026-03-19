import {Controller, Get} from '@nestjs/common';
import {OptionalAuth} from "@thallesp/nestjs-better-auth";

@Controller('health')
export class HealthController {

    @OptionalAuth()
    @Get()
    getHealth() {
        return {
            application: 'Welcome to Weally backend',
            health: 'operational'
        }
    }
}
