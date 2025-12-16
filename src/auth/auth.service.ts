import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

export interface LoginResponse {
  tokens: TokenResponse;
  user: User;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Permet de valider l'email et le mot de passe d'un utilisateur.
   *
   * @param email
   * @param password
   */
  async validateUser(email: string, password: string) : Promise<User> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  /**
   * Permet de se login et de générer des nouveaux tokens.
   *
   * @param email
   * @param password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);
    const payload = user.strictInfo();

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return {
      tokens: { access_token, refresh_token },
      user,
    };
  }
}
