import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserClient } from '../users/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { CreateUserDto } from './dto/create-user.dto';

export interface LoginResponse {
  tokens: TokenResponse;
  user: UserClient;
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
  async validateUser(email: string, password: string): Promise<UserClient> {
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

    return this.createTokens(user);
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Permet de rafraichir ses tokens.
   *
   * @param refreshToken le refresh token de l'utilisateur
   */
  async refresh(refreshToken: RefreshTokenDto): Promise<LoginResponse> {
    let user: UserClient | null;

    try {
      const userInfo = this.jwtService.verify(refreshToken.refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      user = await this.usersService.findOne(userInfo.id);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user) throw new UnauthorizedException('User not found');

    return this.createTokens(user);
  }

  createTokens(user: UserClient) {
    const payloadAccess = { ...user.basicInfo(), type: 'access_token' };
    const payloadRefresh = { ...user.strictInfo(), type: 'refresh_token' };

    const access_token = this.jwtService.sign(payloadAccess, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payloadRefresh, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '14d',
    });

    return {
      tokens: { access_token, refresh_token },
      user,
    };
  }
}
