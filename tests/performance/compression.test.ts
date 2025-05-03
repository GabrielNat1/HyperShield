import { CompressionService } from '../../src/domains/compression/application/compressionService';

describe('Compression Performance Tests', () => {
  let service: CompressionService;

  beforeEach(() => {
    service = new CompressionService({ level: 6 });
  });

  it('should handle rapid successive compressions', async () => {
    const data = 'test'.repeat(1000);
    const iterations = 1000;
    const startTime = Date.now();

    const promises = Array.from({ length: iterations }, () => 
      service.compress(data)
    );

    const results = await Promise.all(promises);
    const endTime = Date.now();
    const timePerOperation = (endTime - startTime) / iterations;

    console.log(`Average compression time: ${timePerOperation.toFixed(2)}ms`);
    expect(timePerOperation).toBeLessThan(50); // Should be fast
    expect(results).toHaveLength(iterations);
  }, 30000);

  it('should compare compression levels performance', async () => {
    const data = 'test'.repeat(10000);
    const results: Record<string, { time: number, size: number }> = {};

    for (let level = 1; level <= 9; level++) {
      const service = new CompressionService({ level });
      const start = Date.now();
      const compressed = await service.compress(data);
      const time = Date.now() - start;

      results[`level${level}`] = {
        time,
        size: compressed.length
      };
    }

    console.table(results);
    expect(Object.keys(results)).toHaveLength(9);
  }, 30000);
});
