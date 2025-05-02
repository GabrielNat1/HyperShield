import { GzipCompressor } from '../../../src/domains/compression/application/gzipCompressor';

describe('GzipCompressor', () => {
  let compressor: GzipCompressor;

  beforeEach(() => {
    compressor = new GzipCompressor();
  });

  it('should compress and decompress data correctly', async () => {
    const testData = 'Hello, World!';
    const compressed = await compressor.compress(testData);
    const decompressed = await compressor.decompress(compressed);

    expect(Buffer.from(decompressed).toString()).toBe(testData);
  });

  it('should throw error on empty data', async () => {
    await expect(compressor.compress('')).rejects.toThrow('Invalid input: empty data');
  });

  it('should compress with different levels', async () => {
    const highCompression = new GzipCompressor(9);
    const lowCompression = new GzipCompressor(1);

    const testData = 'A'.repeat(1000);
    const highCompressed = await highCompression.compress(testData);
    const lowCompressed = await lowCompression.compress(testData);

    expect(highCompressed.length).toBeLessThanOrEqual(lowCompressed.length);
  });
});
