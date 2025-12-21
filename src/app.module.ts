import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { FamilyModule } from './family/family.module';
import { CLoggingModule } from './c-logging/c-logging.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FoodModule } from './food/food.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    FamilyModule,
    CLoggingModule,
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),
    FoodModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
