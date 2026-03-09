import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marque une route comme publique (pas d'auth requise)
 * @example @Public() @Get('health')
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
