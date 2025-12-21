import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './jwt/JwtAccessStrategy';
import { JwtRefreshStrategy } from './jwt/JwtRefreshStrategy';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
