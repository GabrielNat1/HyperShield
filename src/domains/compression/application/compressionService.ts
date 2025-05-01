import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { COMPRESSION } from '../../../core/constants/constants';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export interface CompressionOptions {
    level?: number;
    threshold?: number;
    memLevel?: number;
    strategy?: number;
}

export class CompressionService {
    private options: CompressionOptions;

    constructor(options: CompressionOptions = {}) {
        this.options = {
            level: options.level ?? COMPRESSION.GZIP.DEFAULT_LEVEL,
            threshold: options.threshold ?? COMPRESSION.GZIP.MIN_SIZE_TO_COMPRESS,
            memLevel: options.memLevel ?? COMPRESSION.GZIP.DEFAULT_MEM_LEVEL
        };
    }

    private shouldCompress(data: string | Buffer): boolean {
        const size = Buffer.byteLength(data);
        return size >= (this.options.threshold ?? 0);
    }

    async compress(data: string | Buffer): Promise<Buffer> {
        try {
            if (!this.shouldCompress(data)) {
                return Buffer.from(data);
            }

            const input = Buffer.isBuffer(data) ? data : Buffer.from(data);
            return await gzipAsync(input, {
                level: this.options.level,
                memLevel: this.options.memLevel
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Compression failed: ${errorMessage}`);
        }
    }

    async decompress(data: Buffer): Promise<Buffer> {
        try {
            return await gunzipAsync(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Decompression failed: ${errorMessage}`);
        }
    }

    async compressString(data: string): Promise<Buffer> {
        return this.compress(data);
    }

    async decompressToString(data: Buffer): Promise<string> {
        const decompressed = await this.decompress(data);
        return decompressed.toString();
    }

    isCompressed(data: Buffer): boolean {
        // Check for GZIP magic numbers (1f 8b)
        return data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b;
    }
}
