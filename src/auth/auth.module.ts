import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategies/jwt.strategy';
import { JwtAccessGuard } from './guards/jwt.guard';

@Module({
    imports: [
        PassportModule,
        // JwtModule sans config globale : chaque sign() précise son secret
        JwtModule.register({}),
    ],
    providers: [
        AuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        // Guard global : toutes les routes sont protégées par défaut
        // Utiliser @Public() pour les routes ouvertes
        {
            provide: APP_GUARD,
            useClass: JwtAccessGuard,
        },
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}