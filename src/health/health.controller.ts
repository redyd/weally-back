import { Controller, Get, Logger } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('health')
export class HealthController {
  private logger = new Logger('HealthController');

  @Get()
  getHealth() {
    this.logger.log('Getting health');
    return 'This system server is running.';
  }
}
