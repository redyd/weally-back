import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { FamilyModule } from './family/family.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, FamilyModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
