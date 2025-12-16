import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() user : LoginDto) : Promise<LoginResponse> {
    return this.authService.login(user.email, user.password);
  }
}
