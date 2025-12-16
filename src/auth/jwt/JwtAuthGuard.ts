import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard utilisé par JwtAccessStrategy
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
