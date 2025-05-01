import { config } from 'dotenv';
config();

export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    maxRetries?: number;
    retryDelay?: number;
    db?: number;
}

const redisConfig: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000'),
    db: parseInt(process.env.REDIS_DB || '0')
};

export default redisConfig;
