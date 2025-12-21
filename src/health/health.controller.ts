import { Controller, Get, Logger } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
export class HealthController {
  private logger = new Logger('HealthController');

  @SkipThrottle({ short: true, long: true })
  @Get()
  getHealth() {
    this.logger.log('Getting health');
    return 'This system server is running.';
  }
}
