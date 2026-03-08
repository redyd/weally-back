import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaAuthModule } from './prisma-auth/prisma-auth.module';
import { PrismaWeallyModule } from './prisma-weally/prisma-weally.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FamilyModule } from './family/family.module';
import { MealModule } from './meal/meal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaAuthModule,        // schéma auth
    PrismaWeallyModule,  // schéma weally
    RedisModule,
    AuthModule,
    UsersModule,
    FamilyModule,
    MealModule,
  ],
})
export class AppModule {}