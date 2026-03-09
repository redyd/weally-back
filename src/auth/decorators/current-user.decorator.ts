import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Injecte l'utilisateur courant depuis req.users
 * @example async getMe(@CurrentUser() users: UserFromJwt) {}
 */
export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
    },
);
