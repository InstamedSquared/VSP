const knex = require('knex')(require('./knexfile').development);
async function run() {
    try {
        await knex.schema.alterTable('employees', t => { t.string('un', 100).alter(); });
        await knex.schema.alterTable('users', t => { t.string('un', 100).alter(); });
        await knex.schema.alterTable('clients', t => { t.string('un', 100).alter(); });
        
        // Also fix the truncated username for ID 4
        await knex('employees').where({ id: 4 }).update({ un: 'squared@vitalsolutionpartners.com' });
        console.log('Tables updated successfully');
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
run();
