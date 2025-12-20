import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { UserClient } from '../../users/entities/user.entity';

interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  type: 'access_token' | 'refresh_token';
}

/**
 * Cette classe permet de décoder le token d'accès et de vérifier sa validité.
 * Si la date a expiré ou que c'est un mauvais type de token, la requête sera refusée.
 */
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload) : Promise<UserClient> {
    if (payload.type !== 'access_token') {
      throw new UnauthorizedException('Invalid token type');
    }

    const plainUser = await this.databaseService.user.findUnique({
      where: { id: +payload.id },
      include: { member: true },
    });

    if (!plainUser) {
      throw new UnauthorizedException('Invalid user');
    }

    const user = new UserClient(plainUser);

    if (user.role !== payload.role) {
      throw new UnauthorizedException('Expired token. Please refresh it.');
    }

    return user;
  }
}
