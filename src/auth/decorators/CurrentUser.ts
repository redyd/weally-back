import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../../users/entities/UserTypes';

/**
 * Récupère automatiquement les informations basiques de l'utilisateur
 * (info présente dans son token) grâce à l'annotation @CurrentUser
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
