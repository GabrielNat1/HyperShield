/*import express from 'express';
import { HyperShield } from '../../src';

const app = express();
const shield = new HyperShield({
    cache: {
        enabled: true,
        provider: 'redis',
        ttl: 3600,
        connection: {
            host: 'localhost',
            port: 6379
        }
    },
    compression: {
        enabled: true,
        type: 'gzip',
        level: 6
    }
});

shield.initialize();

// Exemplo de rota cacheada e comprimida
app.get('/api/products', shield.compression(), shield.cache(), (req, res) => {
    res.json([
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
    ]);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
*/