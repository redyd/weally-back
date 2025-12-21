import { Module } from '@nestjs/common';
import { CLoggingService } from './c-logging.service';

@Module({
  providers: [CLoggingService],
  exports: [CLoggingService],
})
export class CLoggingModule {}
