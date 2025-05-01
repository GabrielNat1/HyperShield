export interface ICacheProvider {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;

    /**
     * Gets multiple values by their keys
     */
    mget<T>(keys: string[]): Promise<(T | null)[]>;

    /**
     * Checks if a key exists without retrieving its value
     */
    exists(key: string): Promise<boolean>;

    /**
     * Updates the TTL of an existing key
     */
    updateTTL(key: string, ttl: number): Promise<boolean>;

    /**
     * Gets the remaining TTL of a key in seconds
     */
    getTTL(key: string): Promise<number | null>;
}
