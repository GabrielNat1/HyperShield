/* -----------------------------------------------------------------

    * @file constants/index.ts
    * @note Constants defined but not yet implemented in the application.

    ----------------------------------------------------------------- */

export const CACHE = {
    DEFAULT_TTL: 3600,
    MIN_TTL: 1,
    MAX_TTL: 86400, // 24 hr
    RETRY: {
        MAX_ATTEMPTS: 3,
        BASE_DELAY: 1000, // 1 sg
        MAX_DELAY: 5000   // 5 sg
    }
} as const;

export const COMPRESSION = {
    GZIP: {
        MIN_LEVEL: 1,
        MAX_LEVEL: 9,
        DEFAULT_LEVEL: 6,
        DEFAULT_CHUNK_SIZE: 16 * 1024, // 16KB
        DEFAULT_MEM_LEVEL: 8,
        MIN_SIZE_TO_COMPRESS: 1024 // 1KB
    },
    CONTENT_TYPES: {
        COMPRESSIBLE: [
            'text/',
            'application/json',
            'application/javascript',
            'application/xml',
            'application/x-www-form-urlencoded'
        ]
    }
} as const;

export const ALERTS = {
    THROTTLE: {
        DEFAULT_MS: 1000,
        MIN_MS: 100,
        MAX_MS: 60000 // 1 min
    },
    RETRY: {
        DEFAULT_ATTEMPTS: 3,
        MAX_ATTEMPTS: 5,
        BASE_DELAY: 1000
    }
} as const;

export const HTTP = {
    STATUS_CODES: {
        OK: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    },
    HEADERS: {
        CACHE_CONTROL: 'Cache-Control',
        CONTENT_TYPE: 'Content-Type',
        CONTENT_ENCODING: 'Content-Encoding'
    }
} as const;

export const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
} as const;
