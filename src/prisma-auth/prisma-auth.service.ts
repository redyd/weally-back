import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/auth';

@Injectable()
export class PrismaAuthService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaAuthService.name);

    constructor() {
        super({
            datasources: {
                db: { url: process.env.DATABASE_URL },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma Auth connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
