import { createClient, RedisClientType } from 'redis';
import { ICacheProvider } from '../../domains/cache/domain/ICacheProvider';
import { RedisCacheOptions } from '../../core/types/cacheTypes';
import { CompressionService } from '../../domains/compression/application/compressionService';
import { CACHE } from '../../core/constants/constants';

export class RedisCache implements ICacheProvider {
    private client!: RedisClientType;
    private compression: CompressionService;
    private options: RedisCacheOptions;
    private reconnectAttempts = 0;

    constructor(options: RedisCacheOptions) {
        this.options = {
            maxRetries: 3,
            retryDelay: 1000,
            compression: true,
            reconnectStrategy: {
                maxAttempts: 10,
                initialDelay: 1000,
                maxDelay: 30000
            },
            ...options
        };

        this.compression = new CompressionService();
        this.initializeClient();
    }

    private initializeClient(): void {
        const url = this.buildRedisUrl();
        
        this.client = createClient({
            url,
            socket: {
                reconnectStrategy: (retries) => {
                    const { maxAttempts, initialDelay, maxDelay } = this.options.reconnectStrategy!;
                    if (retries >= maxAttempts) return false;
                    
                    const delay = Math.min(
                        initialDelay * Math.pow(2, retries),
                        maxDelay
                    );
                    return delay;
                }
            }
        });

        this.setupEventHandlers();
        this.connect();
    }

    private buildRedisUrl(): string {
        const { host, port, password, tls, db } = this.options;
        const protocol = tls ? 'rediss' : 'redis';
        const auth = password ? `:${password}@` : '';
        const database = db ? `/${db}` : '';
        return `${protocol}://${auth}${host}:${port}${database}`;
    }

    private setupEventHandlers(): void {
        this.client.on('error', this.handleError.bind(this));
        this.client.on('connect', () => {
            this.reconnectAttempts = 0;
            console.log('Redis connected successfully');
        });
        this.client.on('reconnecting', () => {
            this.reconnectAttempts++;
            console.log(`Redis reconnecting... Attempt ${this.reconnectAttempts}`);
        });
    }

    private handleError(error: Error): void {
        console.error('Redis client error:', error);
    }

    private async connect(): Promise<void> {
        try {
            await this.client.connect();
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.client.get(key);
            if (!value) return null;

            const compressed = value.startsWith(CACHE.COMPRESSION_PREFIX);
            const data = compressed ? value.slice(CACHE.COMPRESSION_PREFIX.length) : value;

            return await this.maybeDecompress<T>(data, compressed);
        } catch (error) {
            console.error(`Redis get error: ${error}`);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        try {
            const [data, compressed] = await this.maybeCompress(value);
            const finalValue = compressed ? CACHE.COMPRESSION_PREFIX + data : data;

            if (ttl) {
                await this.client.setEx(key, ttl, finalValue);
            } else {
                await this.client.set(key, finalValue);
            }
        } catch (error) {
            console.error(`Redis set error: ${error}`);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            console.error(`Redis delete error: ${error}`);
        }
    }

    async clear(): Promise<void> {
        try {
            await this.client.flushAll();
        } catch (error) {
            console.error(`Redis clear error: ${error}`);
        }
    }

    async mget<T>(keys: string[]): Promise<(T | null)[]> {
        try {
            const values = await this.client.mGet(keys);
            return await Promise.all(
                values.map(async (value) => {
                    if (!value) return null;

                    const compressed = value.startsWith(CACHE.COMPRESSION_PREFIX);
                    const data = compressed ? value.slice(CACHE.COMPRESSION_PREFIX.length) : value;

                    return await this.maybeDecompress<T>(data, compressed);
                })
            );
        } catch (error) {
            console.error(`Redis mget error: ${error}`);
            return new Array(keys.length).fill(null);
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            console.error(`Redis exists error: ${error}`);
            return false;
        }
    }

    async updateTTL(key: string, ttl: number): Promise<boolean> {
        try {
            return await this.client.expire(key, ttl);
        } catch (error) {
            console.error(`Redis updateTTL error: ${error}`);
            return false;
        }
    }

    async getTTL(key: string): Promise<number | null> {
        try {
            const ttl = await this.client.ttl(key);
            return ttl >= 0 ? ttl : null;
        } catch (error) {
            console.error(`Redis getTTL error: ${error}`);
            return null;
        }
    }

    private async maybeCompress<T>(value: T): Promise<[Buffer | string, boolean]> {
        if (!this.options.compression) return [JSON.stringify(value), false];
        
        const stringified = JSON.stringify(value);
        if (stringified.length < 1024) return [stringified, false];
        
        const compressed = await this.compression.compress(stringified);
        return [compressed, true];
    }

    private async maybeDecompress<T>(data: string | Buffer, compressed: boolean): Promise<T> {
        if (!compressed) return JSON.parse(data as string);
        const decompressed = await this.compression.decompress(data as Buffer);
        return JSON.parse(decompressed.toString());
    }
}
