import { ICacheProvider } from '../../domains/cache/domain/ICacheProvider';
import { MemoryCacheOptions, CacheEntry } from '../../core/types/cacheTypes';
import { CompressionService } from '../../domains/compression/application/compressionService';

export class MemoryCache implements ICacheProvider {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private compression: CompressionService;
    private options: Required<MemoryCacheOptions>;
    private currentSize = 0;
    private pruneIntervalId?: NodeJS.Timeout;

    constructor(options: MemoryCacheOptions = {}) {
        this.compression = new CompressionService();
        this.options = {
            compression: true,
            maxItems: 1000,
            maxMemorySize: 100 * 1024 * 1024, // 100MB
            pruneInterval: 60000, // 1 minute
            ttl: 3600,
            maxSize: 1024 * 1024, // 1MB default
            ...options
        };

        this.startPruneInterval();
    }

    private startPruneInterval(): void {
        this.pruneIntervalId = setInterval(() => this.prune(), this.options.pruneInterval);
        this.pruneIntervalId.unref(); // Allow process to exit if this is the only timer
    }

    public cleanup(): void {
        if (this.pruneIntervalId) {
            clearInterval(this.pruneIntervalId);
            this.pruneIntervalId = undefined;
        }
    }

    private async prune(): Promise<void> {
        const now = Date.now();
        let deletedSize = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (this.isExpired(entry, now)) {
                deletedSize += entry.size;
                this.cache.delete(key);
            }
        }

        this.currentSize -= deletedSize;

        // If still over limits, remove LRU entries
        if (this.cache.size > this.options.maxItems || 
            this.currentSize > this.options.maxMemorySize) {
            this.pruneLRU();
        }
    }

    private pruneLRU(): void {
        const entries = Array.from(this.cache.entries())
            .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

        while (this.cache.size > this.options.maxItems || 
               this.currentSize > this.options.maxMemorySize) {
            const [key, entry] = entries.shift()!;
            this.currentSize -= entry.size;
            this.cache.delete(key);
        }
    }

    private isExpired(entry: CacheEntry<any>, now: number): boolean {
        return entry.expiresAt !== undefined && entry.expiresAt <= now;
    }

    private calculateSize(value: any): number {
        const str = JSON.stringify(value);
        return Buffer.byteLength(str, 'utf8');
    }

    async get<T>(key: string): Promise<T | null> {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (this.isExpired(entry, Date.now())) {
            this.cache.delete(key);
            this.currentSize -= entry.size;
            return null;
        }

        entry.lastAccessed = Date.now();
        this.cache.set(key, entry);

        try {
            if (this.options.compression && Buffer.isBuffer(entry.value)) {
                const decompressed = await this.compression.decompress(entry.value);
                return JSON.parse(decompressed.toString()) as T;
            }
            return entry.value;
        } catch (error) {
            console.error('Cache decompression error:', error);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const size = this.calculateSize(value);

        let valueToStore: any = value;
        if (this.options.compression) {
            valueToStore = await this.compression.compress(JSON.stringify(value));
        }

        const entry: CacheEntry<any> = {
            value: valueToStore,
            size,
            expiresAt: ttl ? Date.now() + ttl * 1000 : Date.now() + this.options.ttl * 1000,
            lastAccessed: Date.now()
        };

        this.cache.set(key, entry);
        this.currentSize += size;

        if (this.cache.size > this.options.maxItems || 
            this.currentSize > this.options.maxMemorySize) {
            await this.prune();
        }
    }

    async delete(key: string): Promise<void> {
        const entry = this.cache.get(key);
        if (entry) {
            this.currentSize -= entry.size;
            this.cache.delete(key);
        }
    }

    async clear(): Promise<void> {
        this.cache.clear();
        this.currentSize = 0;
    }

    async mget<T>(keys: string[]): Promise<(T | null)[]> {
        return Promise.all(keys.map(key => this.get<T>(key)));
    }

    async exists(key: string): Promise<boolean> {
        const entry = this.cache.get(key);
        if (!entry) return false;
        if (this.isExpired(entry, Date.now())) {
            this.cache.delete(key);
            this.currentSize -= entry.size;
            return false;
        }
        return true;
    }

    async updateTTL(key: string, ttl: number): Promise<boolean> {
        const entry = this.cache.get(key);
        if (!entry) return false;

        entry.expiresAt = Date.now() + ttl * 1000;
        entry.lastAccessed = Date.now();
        this.cache.set(key, entry);
        return true;
    }

    async getTTL(key: string): Promise<number | null> {
        const entry = this.cache.get(key);
        if (!entry?.expiresAt) return null;

        const ttl = Math.ceil((entry.expiresAt - Date.now()) / 1000);
        return ttl > 0 ? ttl : null;
    }
}
