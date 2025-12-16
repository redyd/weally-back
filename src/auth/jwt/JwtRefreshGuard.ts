import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard utilisé par JwtRefreshStrategy
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
