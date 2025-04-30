import { createClient, RedisClientType } from 'redis';
import { ICacheProvider } from '../../domains/cache/domain/ICacheProvider';

export class RedisCache implements ICacheProvider {
    private client: RedisClientType;

    constructor(config: { host: string; port: number; password?: string }) {
        const url = `redis://${config.password ? `:${config.password}@` : ''}${config.host}:${config.port}`;
        this.client = createClient({ url });
        this.client.connect().catch(err => {
            throw new Error(`Falha ao conectar ao Redis: ${err.message}`);
        });

        this.client.on('error', (err) => {
            console.error('Erro no cliente Redis:', err);
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
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
