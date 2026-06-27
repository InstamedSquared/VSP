const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
const db = require('./server/config/db');

async function listTables() {
    try {
        const [tables] = await db.raw('SHOW TABLES');
        console.log('Tables in database:');
        console.log(JSON.stringify(tables, null, 2));
    } catch (err) {
        console.error('Error listing tables:', err);
    }
    process.exit(0);
}

listTables();
