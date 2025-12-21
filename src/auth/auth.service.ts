import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

  private readonly logger = new Logger('AuthService');

  /**
   * Permet de valider l'email et le mot de passe d'un utilisateur.
   *
   * @param email
   * @param password
   */
  async validateUser(email: string, password: string): Promise<UserClient> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      this.logger.log(`User ${email} try to log with invalid credentials`);
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Permet de se login et de générer des nouveaux tokens.
   *
   * @param email
   * @param password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    this.logger.log(`User ${email} is trying to login`);
    const user = await this.validateUser(email, password);
    this.logger.log(`User ${email} has been logged in`);

    return this.createTokens(user);
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log(
      `Trying to register for ${createUserDto.email} | ${createUserDto.username}`,
    );
    const user: UserClient = await this.usersService.create(createUserDto);
    this.logger.log(`User ${user.email} registered`);
    return user;
  }

  /**
   * Permet de rafraichir ses tokens.
   *
   * @param refreshDto le refresh token de l'utilisateur
   */
  async refresh(refreshDto: RefreshTokenDto): Promise<LoginResponse> {
    this.logger.log(
      `Trying to refresh token for user ${refreshDto.refresh_token}`,
    );
    let user: UserClient | null;

    try {
      const userInfo = this.jwtService.verify(refreshDto.refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      user = await this.usersService.findOne(userInfo.id);
    } catch (error) {
      this.logger.log(
        `Failed to refresh token for user ${refreshDto.refresh_token}`,
      );
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user) {
      this.logger.log(`User with token ${refreshDto.refresh_token} not found`);
      throw new UnauthorizedException('User not found');
    }

    this.logger.log(`Token has been refreshed for user ${user.email}`);
    return this.createTokens(user);
  }

  createTokens(user: UserClient): LoginResponse {
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
