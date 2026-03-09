import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FamilyModule } from './family/family.module';
import { MealModule } from './meal/meal.module';
import { AlimentModule } from './aliment/aliment.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        RedisModule,
        AuthModule,
        UsersModule,
        FamilyModule,
        MealModule,
        AlimentModule,
    ],
})
export class AppModule {}
