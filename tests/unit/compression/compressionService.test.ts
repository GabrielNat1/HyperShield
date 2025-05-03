import { CompressionService } from '../../../src/domains/compression/application/compressionService';

describe('CompressionService', () => {
  let service: CompressionService;

  beforeEach(() => {
    service = new CompressionService({ level: 6 });
  });

  it('should compress and decompress data correctly', async () => {
    const original = 'test'.repeat(1000); // Make data larger to ensure compression
    const compressed = await service.compress(original);
    const decompressed = await service.decompressToString(compressed);

    expect(decompressed).toBe(original);
    expect(compressed.length).toBeLessThan(original.length);
  });

  it('should not compress small data below threshold', async () => {
    const service = new CompressionService({ threshold: 1000 });
    const smallData = 'small string';
    const compressed = await service.compress(smallData);

    expect(Buffer.from(compressed).toString()).toBe(smallData);
  });

  it('should detect compressed data', async () => {
    const data = 'test'.repeat(1000);
    const compressed = await service.compress(data);
    
    // Check if the buffer starts with gzip magic numbers
    const isCompressed = compressed[0] === 0x1f && compressed[1] === 0x8b;
    expect(isCompressed).toBe(true);
    expect(service.isCompressed(Buffer.from('not compressed'))).toBe(false);
  });

  it('should handle different compression levels', async () => {
    const data = 'test'.repeat(1000);
    const lowCompression = new CompressionService({ level: 1 });
    const highCompression = new CompressionService({ level: 9 });

    const lowCompressed = await lowCompression.compress(data);
    const highCompressed = await highCompression.compress(data);

    expect(highCompressed.length).toBeLessThanOrEqual(lowCompressed.length);
  });

  it('should handle empty data correctly', async () => {
    expect.assertions(1);
    await expect(service.compress('')).rejects.toThrow('Compression failed');
  });

  it('should respect compression threshold', async () => {
    const service = new CompressionService({ threshold: 100 });
    const smallData = 'small';
    const largeData = 'x'.repeat(200);

    const smallCompressed = await service.compress(smallData);
    const largeCompressed = await service.compress(largeData);

    expect(Buffer.from(smallCompressed).toString()).toBe(smallData); // Not compressed
    expect(largeCompressed.length).toBeLessThan(largeData.length); // Compressed
  });

  it('should compress with different compression levels', async () => {
    const data = 'test'.repeat(1000);
    
    const lowService = new CompressionService({ level: 1 });
    const highService = new CompressionService({ level: 9 });

    const [lowCompressed, highCompressed] = await Promise.all([
      lowService.compress(data),
      highService.compress(data)
    ]);

    expect(highCompressed.length).toBeLessThanOrEqual(lowCompressed.length);
  });
});
