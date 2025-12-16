import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  id: string;
  email: string;
  type: 'access_token' | 'refresh_token';
}

/**
 * Cette classe permet de décoder le token d'accès et de vérifier sa validité.
 * Si la date a expiré ou que c'est un mauvais type de token, la requête sera refusée.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'refresh_token') {
      throw new UnauthorizedException('Invalid token type');
    }

    return { id: payload.id, email: payload.email };
  }
}
