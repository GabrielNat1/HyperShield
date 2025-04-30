/*
import { CompressionFactory } from '../../src/services/factories/compressionFactory';

async function compressLargeData() {
    const compressor = CompressionFactory.createCompressor('gzip', {
        level: 9, // máxima compressão
        chunkSize: 16 * 1024 // 16KB chunks
    });

    const largeData = Buffer.from('...large data...');
    const compressed = await compressor.compress(largeData);
    console.log(`Compression ratio: ${(compressed.length / largeData.length * 100).toFixed(2)}%`);
}
*/