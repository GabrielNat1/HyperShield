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
        /* --------------------------------------------------------------
             * @note: Explanation of compression types
             --------------------------------------------------------------
             - 'gzip': Uses the DEFLATE algorithm (RFC 1952). It's widely supported across web servers,
                       browsers, and libraries. Efficient and fast, especially suitable for compressing
                       text-based formats like HTML, CSS, and JSON. Currently implemented via `GzipCompressor`.

             - 'brotli': A modern compression algorithm developed by Google. It typically achieves better
                         compression ratios than Gzip, especially for web content. Supported by modern
                         browsers and ideal for production environments. However, it may be slower
                         during compression compared to Gzip.

             - 'deflate': Also based on the DEFLATE algorithm (RFC 1951), similar to Gzip but without
                          additional headers. It results in slightly smaller output, but is less commonly
                          used directly in APIs or browsers. Can be useful when minimal overhead is needed.
                          Not implemented yet.
        */
            case 'gzip':
                compressor = new GzipCompressor(validatedOptions.level);
                break;
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
