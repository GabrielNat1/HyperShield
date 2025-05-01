import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { ICompressor } from '../domain/ICompressor';
import { COMPRESSION } from '../../../core/constants/constants';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export class GzipCompressor implements ICompressor {
    private level: number;

    constructor(level: number = COMPRESSION.GZIP.DEFAULT_LEVEL) {
        this.level = Math.min(
            Math.max(level, COMPRESSION.GZIP.MIN_LEVEL),
            COMPRESSION.GZIP.MAX_LEVEL
        );
    }

    async compress(data: string | Buffer): Promise<Buffer> {
        if (!data || (typeof data === 'string' && !data.length)) {
            throw new Error('Invalid input: empty data');
        }

        try {
            const input = Buffer.isBuffer(data) ? data : Buffer.from(data);
            return await gzipAsync(input, { level: this.level });
        } catch (error) {
            console.error(`Compression error: ${error}`);
            throw new Error(`Failed to compress data: ${error}`);
        }
    }

    async decompress(data: Buffer): Promise<Buffer> {
        return gunzipAsync(data);
    }
}
