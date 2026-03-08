import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/weally';

@Injectable()
export class PrismaWeallyService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaWeallyService.name);

  constructor() {
    super({
      datasources: {
        db: { url: process.env.DATABASE_URL_WEALLY },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma Weally connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
