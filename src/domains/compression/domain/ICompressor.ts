


export interface ICompressor {
    compress(data: string | Buffer): Promise<Buffer>;
    decompress(data: Buffer): Promise<Buffer>;
}
