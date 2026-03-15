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
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '{msg} [{req.method} {req.url}]',
          },
        },
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: {
          paths: ['req.headers.cookie', 'req.headers.authorization'],
          censor: '[REDACTED]',
        },
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            remoteAddress: req.remoteAddress,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
        customSuccessMessage: (req, res) =>
            `${req.method} ${req.url} → ${res.statusCode}`,
        autoLogging: {
          ignore: (req) => req.url === '/health',
        },
      },
    }),
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
