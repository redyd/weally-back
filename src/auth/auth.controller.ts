import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtRefreshGuard } from './guards/jwt.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /api/v1/auth/register
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return { message: 'Compte créé avec succès', user };
  }

  // POST /api/v1/auth/login
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    // Refresh token → HttpOnly cookie
    res.cookie(
      'refresh_token',
      refreshToken,
      this.authService.getCookieOptions(),
    );

    return { accessToken };
  }

  // POST /api/v1/auth/refresh
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: { sub: string; jti: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      user.sub,
      user.jti,
    );

    // Rotation du cookie
    res.cookie(
      'refresh_token',
      refreshToken,
      this.authService.getCookieOptions(),
    );

    return { accessToken };
  }

  // POST /api/v1/auth/logout
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: { id: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    // On récupère le jti depuis le cookie (via une seconde vérification si besoin)
    // Pour simplifier on révoque tous les tokens de cet appel
    await this.authService.logoutAll(user.id);
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return { message: 'Déconnexion réussie' };
  }

  // POST /api/v1/auth/logout-all  — déconnecte toutes les sessions
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser() user: { id: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logoutAll(user.id);
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return { message: 'Toutes les sessions révoquées' };
  }

  // GET /api/v1/auth/me  — profil de l'utilisateur connecté
  @Get('me')
  async me(@CurrentUser() user: any) {
    return user;
  }
}
