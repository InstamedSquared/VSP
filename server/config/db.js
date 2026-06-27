require('dotenv').config();
const knex = require('knex');

const dbClientType = process.env.DB_CLIENT || 'mysql';

const poolMin = parseInt(process.env.DB_POOL_MIN) || 5; // Increased min pool
const poolMax = parseInt(process.env.DB_POOL_MAX) || 20; // Increased max pool

let knexConfig;

if (dbClientType === 'pg') {
    knexConfig = {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST_PG,
            port: process.env.DB_PORT_PG,
            user: process.env.DB_USER_PG,
            password: process.env.DB_PASSWORD_PG,
            database: process.env.DB_NAME_PG,
        }
    };
}
else {
    knexConfig = {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST_MYSQL,
            port: process.env.DB_PORT_MYSQL,
            user: process.env.DB_USER_MYSQL,
            password: process.env.DB_PASSWORD_MYSQL,
            database: process.env.DB_NAME_MYSQL,
            connectionLimit: poolMax
        }
    };
}

knexConfig.pool = {
    min: poolMin,
    max: poolMax,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000,
    propagateCreateError: false
};

const db = knex(knexConfig);
db.raw('SELECT 1+1 AS result').then(() => { /* Silent success */ }).catch((err) => { console.error(`🔴 DB Connection Failed in Worker ${process.pid}:`, err.message); process.exit(1); });

module.exports = db;