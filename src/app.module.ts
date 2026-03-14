import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FamilyModule } from './family/family.module';
import { MealModule } from './meal/meal.module';
import { auth } from './lib/auth';
import { AuthModule, AuthGuard } from '@thallesp/nestjs-better-auth';
import { PlanningModule } from './planning/planning.module';
import {LoggerModule} from "nestjs-pino";
import { InvitationModule } from './invitation/invitation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule.forRoot({ auth }),
    UsersModule,
    FamilyModule,
    MealModule,
    PlanningModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    InvitationModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
