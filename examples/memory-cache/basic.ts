/*import express from 'express';
import { HyperShield } from '../../src';

const app = express();
const shield = new HyperShield({
    cache: {
        enabled: true,
        provider: 'memory', // usando cache em memória em vez de Redis
        ttl: 3600
    },
    compression: {
        enabled: true,
        type: 'gzip'
    }
});

shield.initialize();

// Exemplo de API com cache em memória
app.get('/api/data', shield.cache(), (req, res) => {
    res.json({ timestamp: new Date(), data: 'Cached in memory' });
});

app.listen(3000, () => {
    console.log('Server running with memory cache on http://localhost:3000');
});
*/