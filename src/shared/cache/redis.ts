import { createClient, RedisClientType } from 'redis';
import { ICacheProvider } from '../../domains/cache/domain/ICacheProvider';

export class RedisCache implements ICacheProvider {
    private client: RedisClientType;

    constructor(config: { host: string; port: number; password?: string; maxRetries?: number }) {
        const url = `redis://${config.password ? `:${config.password}@` : ''}${config.host}:${config.port}`;
        interface RetryStrategy {
            (retryAttempts: number): number | null;
        }

        interface RedisClientConfig {
            url: string;
            retry_strategy: RetryStrategy;
        }

        this.client = createClient({ 
            url,
            retry_strategy: (times: number): number | null => {
            if (times > (config.maxRetries ?? 3)) return null;
            return Math.min(times * 100, 3000);
            }
        } as RedisClientConfig);

        this.client.connect().catch(err => {
            throw new Error(`Falha ao conectar ao Redis: ${err.message}`);
        });

        this.client.on('error', (err) => {
            console.error('Erro no cliente Redis:', err);
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Redis get error: ${error}`);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const serialized = JSON.stringify(value);
        if (ttl) {
            await this.client.setEx(key, ttl, serialized);
        } else {
            await this.client.set(key, serialized);
        }
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    async clear(): Promise<void> {
        await this.client.flushAll();
    }
}
