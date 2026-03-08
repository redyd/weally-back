import { Global, Module } from '@nestjs/common';
import { PrismaWeallyService } from './prisma-weally.service';

@Global()
@Module({
    providers: [PrismaWeallyService],
    exports: [PrismaWeallyService],
})
export class PrismaWeallyModule {}