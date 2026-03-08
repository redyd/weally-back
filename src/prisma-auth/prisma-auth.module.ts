import { Global, Module } from '@nestjs/common';
import { PrismaAuthService } from './prisma-auth.service';

@Global()
@Module({
    providers: [PrismaAuthService],
    exports: [PrismaAuthService],
})
export class PrismaAuthModule {}