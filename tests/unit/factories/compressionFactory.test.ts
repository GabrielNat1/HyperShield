import { CompressionFactory } from '../../../src/services/factories/compressionFactory';

describe('CompressionFactory', () => {
  beforeEach(() => {
    CompressionFactory.clearInstances();
  });

  it('should create gzip compressor', () => {
    const compressor = CompressionFactory.createCompressor('gzip', { level: 6 });
    expect(compressor).toBeDefined();
  });

  it('should reuse existing instances with same config', () => {
    const compressor1 = CompressionFactory.createCompressor('gzip', { level: 6 });
    const compressor2 = CompressionFactory.createCompressor('gzip', { level: 6 });
    expect(compressor1).toBe(compressor2);
  });

  it('should create different instances for different configs', () => {
    const compressor1 = CompressionFactory.createCompressor('gzip', { level: 6 });
    const compressor2 = CompressionFactory.createCompressor('gzip', { level: 9 });
    expect(compressor1).not.toBe(compressor2);
  });

  it('should throw for unsupported compression types', () => {
    expect(() => CompressionFactory.createCompressor('invalid' as any))
      .toThrow('Compressor type');
  });

  it('should validate compression options', () => {
    const compressor = CompressionFactory.createCompressor('gzip', { level: 999 });
    expect(compressor).toBeDefined();
    // Level should be capped at 9
  });
});
