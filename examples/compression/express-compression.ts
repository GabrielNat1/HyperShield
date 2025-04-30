/*

import express from 'express';
import { HyperShield } from '../../src';

const app = express();
const shield = new HyperShield({
    compression: {
        enabled: true,
        type: 'gzip',
        level: 6,
        threshold: 1024 // Comprimir apenas respostas maiores que 1KB
    }
});

// Exemplo com dados grandes
app.get('/api/large-data', shield.compression(), (req, res) => {
    const largeData = generateLargeData(); // Simula dados grandes
    res.json({ data: largeData });
});

// Exemplo com configuração personalizada por rota
app.get('/api/max-compression', 
    shield.compression({ level: 9 }), 
    (req, res) => {
        res.json({ data: 'maximum compression' });
    }
);

function generateLargeData() {
    return Array(1000).fill(0).map((_, i) => ({
        id: i,
        data: 'Lorem ipsum dolor sit amet...'
    }));
}

app.listen(3000, () => {
    console.log('Compression example running on http://localhost:3000');
});

*/