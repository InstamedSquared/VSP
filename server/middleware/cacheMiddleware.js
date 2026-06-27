const NodeCache = require('node-cache');
const logger = require('../config/logger');

// Standard TTL: 60 seconds, Check period: 120 seconds
const myCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const cache = (duration) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;
        const cachedResponse = myCache.get(key);

        if (cachedResponse) {
            // logger.info(`Cache Hit: ${key}`);
            return res.json(cachedResponse);
        } else {
            // logger.info(`Cache Miss: ${key}`);
            res.originalJson = res.json;
            res.json = (body) => {
                myCache.set(key, body, duration);
                res.originalJson(body);
            };
            next();
        }
    };
};

cache.clear = (pattern) => {
    const keys = myCache.keys();
    const matches = keys.filter(key => key.includes(pattern));
    if (matches.length > 0) {
        myCache.del(matches);
    }
};

module.exports = cache;
