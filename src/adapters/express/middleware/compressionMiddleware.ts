import { Request, Response, NextFunction } from 'express';
import { CompressionFactory } from '../../../services/factories/compressionFactory';

export const compressionMiddleware = () => {
    const compressor = CompressionFactory.createCompressor('gzip', { level: 6 });

    return async (req: Request, res: Response, next: NextFunction) => {
        const originalSend = res.send;

        res.send = function(data: any) {
            if (req.headers['accept-encoding']?.includes('gzip')) {
                compressor.compress(data)
                    .then(compressed => {
                        res.setHeader('Content-Encoding', 'gzip');
                        originalSend.call(this, compressed);
                    })
                    .catch(next);
                return this;
            }
            return originalSend.call(this, data);
        };

        next();
    };
};
