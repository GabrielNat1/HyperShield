# API Interfaces Reference

## Cache Interfaces

### ICacheProvider
```typescript
interface ICacheProvider {
    /** Get value by key */
    get<T>(key: string): Promise<T | null>;
    
    /** Set value with optional TTL */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    
    /** Delete key */
    delete(key: string): Promise<void>;
    
    /** Clear all cache */
    clear(): Promise<void>;
    
    /** Get multiple values */
    mget<T>(keys: string[]): Promise<(T | null)[]>;
    
    /** Check key existence */
    exists(key: string): Promise<boolean>;
    
    /** Update TTL for key */
    updateTTL(key: string, ttl: number): Promise<boolean>;
    
    /** Get remaining TTL */
    getTTL(key: string): Promise<number | null>;
}
```

## Compression Interfaces

### ICompressor
```typescript
interface ICompressor {
    /** Compress data */
    compress(data: string | Buffer): Promise<Buffer>;
    
    /** Decompress data */
    decompress(data: Buffer): Promise<Buffer>;
}
```

## Configuration Types

### CacheConfig
```typescript
interface CacheConfig {
    enabled: boolean;
    provider: 'redis' | 'memory';
    ttl: number;
    connection?: {
        host: string;
        port: number;
        password?: string;
    };
}
```

### CompressionConfig 
```typescript
interface CompressionConfig {
    enabled: boolean;
    type: 'gzip';
    level?: number; // 1-9
    threshold?: number; // Minimum size to compress
}
```

### AlertOptions
```typescript
interface AlertOptions {
    destinations: ('console' | 'email' | 'webhook')[];
    throttleMs?: number;
    retryAttempts?: number; 
}
```
