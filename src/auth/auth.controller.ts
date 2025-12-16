import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { JwtRefreshGuard } from './jwt/JwtRefreshGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() user: LoginDto): Promise<LoginResponse> {
    return this.authService.login(user.email, user.password);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refreshToken(@Body() token: RefreshTokenDto): Promise<LoginResponse> {
    return this.authService.refresh(token);
  }
}
