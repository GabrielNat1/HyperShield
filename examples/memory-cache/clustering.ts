/*import cluster from 'cluster';
import { cpus } from 'os';
import express from 'express';
import { HyperShield } from '../../src';

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    
    // Fork workers
    for (let i = 0; i < cpus().length; i++) {
        cluster.fork();
    }
} else {
    const app = express();
    const shield = new HyperShield({
        cache: {
            enabled: true,
            provider: 'memory',
            ttl: 3600
        }
    });

    shield.initialize();
    
    app.get('/api/data', shield.cache(), (req, res) => {
        res.json({ 
            workerId: cluster.worker?.id,
            cached: true,
            timestamp: new Date()
        });
    });

    app.listen(3000);
    console.log(`Worker ${process.pid} started`);
}
*/