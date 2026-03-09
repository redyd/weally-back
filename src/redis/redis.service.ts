import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: Redis;

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            password: this.configService.get<string>('REDIS_PASSWORD'),
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        this.client.on('connect', () => this.logger.log('✅ Redis connecté'));
        this.client.on('error', (err) =>
            this.logger.error('❌ Redis erreur', err),
        );
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    // ─── Refresh token allowlist ───────────────────────────────────────────────

    /**
     * Enregistre un refresh token en Redis avec TTL
     * Clé: refresh_token:{userId}:{tokenId}
     */
    async setRefreshToken(
        userId: string,
        tokenId: string,
        ttlSeconds: number,
    ): Promise<void> {
        const key = this.buildRefreshKey(userId, tokenId);
        await this.client.set(key, '1', 'EX', ttlSeconds);
    }

    /**
     * Vérifie qu'un refresh token est bien dans l'allowlist
     */
    async isRefreshTokenValid(
        userId: string,
        tokenId: string,
    ): Promise<boolean> {
        const key = this.buildRefreshKey(userId, tokenId);
        const val = await this.client.get(key);
        return val === '1';
    }

    /**
     * Révoque un refresh token spécifique (logout simple)
     */
    async revokeRefreshToken(userId: string, tokenId: string): Promise<void> {
        const key = this.buildRefreshKey(userId, tokenId);
        await this.client.del(key);
    }

    /**
     * Révoque TOUS les refresh tokens d'un users (logout de partout)
     */
    async revokeAllRefreshTokens(userId: string): Promise<void> {
        const pattern = this.buildRefreshKey(userId, '*');
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            await this.client.del(...keys);
        }
    }

    private buildRefreshKey(userId: string, tokenId: string): string {
        return `refresh_token:${userId}:${tokenId}`;
    }
}
