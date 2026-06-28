require('dotenv').config();

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST_MYSQL,
            port: process.env.DB_PORT_MYSQL,
            user: process.env.DB_USER_MYSQL,
            password: process.env.DB_PASSWORD_MYSQL,
            database: process.env.DB_NAME_MYSQL,
        },
        migrations: { directory: './migrations' },
        seeds: { directory: './seeds' },
    },
    production: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST_PG,
            port: process.env.DB_PORT_PG,
            user: process.env.DB_USER_PG,
            password: process.env.DB_PASSWORD_PG,
            database: process.env.DB_NAME_PG,
        },
        migrations: { directory: './migrations' },
        seeds: { directory: './seeds' },
    }
};
