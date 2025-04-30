import { ICompressor } from '../../domains/compression/domain/ICompressor';
import { GzipCompressor } from '../../domains/compression/application/gzipCompressor';

export type CompressorType = 'gzip' | 'brotli' | 'deflate';

export interface CompressionOptions {
    level?: number;
    chunkSize?: number;
    memLevel?: number;
}

export class CompressionFactory {
    private static instances: Map<string, ICompressor> = new Map();
    
    private static validateOptions(options?: CompressionOptions): CompressionOptions {
        return {
            level: Math.min(Math.max(options?.level ?? 6, 1), 9),
            chunkSize: options?.chunkSize ?? 16 * 1024,
            memLevel: options?.memLevel ?? 8
        };
    }

    static createCompressor(type: CompressorType, options?: CompressionOptions): ICompressor {
        const key = `${type}-${JSON.stringify(options)}`;
        
        if (this.instances.has(key)) {
            return this.instances.get(key)!;
        }

        const validatedOptions = this.validateOptions(options);
        
        let compressor: ICompressor;
        
        switch (type) {
            case 'gzip':
                compressor = new GzipCompressor(validatedOptions.level);
                break;

            // --------------------------------------------------------------
            // futuros tipos que serão implementados
            case 'brotli':
                throw new Error(`Compressor type '${type}' not implemented yet`);
            case 'deflate':
                throw new Error(`Compressor type '${type}' not implemented yet`);
            default:
                throw new Error(`Compressor type '${type}' not supported`);
        }

        this.instances.set(key, compressor);
        return compressor;
    }

    static clearInstances(): void {
        this.instances.clear();
    }
}
