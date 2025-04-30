import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { ICompressor } from '../domain/ICompressor';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export class GzipCompressor implements ICompressor {
    private level: number;

    constructor(level: number = 6) { // 6 é o nível padrão de compressão
        this.level = level;
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
