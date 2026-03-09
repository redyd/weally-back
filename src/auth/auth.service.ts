import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

const BCRYPT_ROUNDS = 12;
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

export interface AuthTokens {
  accessToken: string;
  refreshTokenId: string; // pour stocker en Redis
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redis: RedisService,
  ) {}

  // ─── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Cet email est déjà utilisé');

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    return await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    return this.generateTokens(user.id, user.email);
  }

  // ─── Refresh ──────────────────────────────────────────────────────────────

  async refresh(userId: string, tokenId: string) {
    const isValid = await this.redis.isRefreshTokenValid(userId, tokenId);
    if (!isValid) {
      // Token inconnu ou déjà révoqué → possible replay attack
      await this.redis.revokeAllRefreshTokens(userId);
      throw new ForbiddenException('Session invalide. Reconnectez-vous.');
    }

    // Rotation : on révoque l'ancien et on en crée un nouveau
    await this.redis.revokeRefreshToken(userId, tokenId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    return this.generateTokens(user.id, user.email);
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(userId: string, tokenId: string) {
    await this.redis.revokeRefreshToken(userId, tokenId);
  }

  async logoutAll(userId: string) {
    await this.redis.revokeAllRefreshTokens(userId);
  }

  // ─── Token generation ─────────────────────────────────────────────────────

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens & { refreshToken: string }> {
    const jti = uuidv4(); // ID unique du refresh token

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, jti },
        {
          secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      ),
    ]);

    // Stocker le refresh token dans Redis (7 jours = 604800 secondes)
    await this.redis.setRefreshToken(userId, jti, 7 * 24 * 60 * 60);

    return { accessToken, refreshToken, refreshTokenId: jti };
  }

  getCookieOptions() {
    return {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      maxAge: COOKIE_MAX_AGE_MS,
      path: '/api/v1/auth', // cookie uniquement envoyé sur les routes auth
    };
  }
}
