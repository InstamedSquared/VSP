const redis = require('redis');
const logger = require('./logger');

let redisClient;

(async () => {
    redisClient = redis.createClient({
        url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    });

    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    redisClient.on('connect', () => logger.info('Redis Client Connected'));

    await redisClient.connect();
})();

module.exports = redisClient;
