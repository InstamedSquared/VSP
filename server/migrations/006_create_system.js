const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return Promise.all([
        // System audit trail
        knex.schema.createTable('audit_logs', (table) => {
            table.increments('id').primary();
            table.integer('id_user').unsigned().nullable();
            table.string('user_type', 10).nullable()
                .comment('0=admin, 1=employee, 2=client');
            table.string('action', 50).notNullable()
                .comment('create, update, delete, login, logout, export');
            table.string('entity_type', 50).nullable()
                .comment('Table or resource name');
            table.integer('entity_id').unsigned().nullable();
            table.text('details').nullable()
                .comment('JSON details of the action');
            table.string('ip_address', 50).nullable();
            addAuditColumns(table, knex);
        }),

        // Multi-channel notification queue
        knex.schema.createTable('notifications', (table) => {
            table.increments('id').primary();
            table.integer('id_user').unsigned().notNullable().index();
            table.string('user_type', 10).notNullable().defaultTo('0')
                .comment('0=admin, 1=employee, 2=client');
            table.string('title', 300).nullable();
            table.text('message').nullable();
            table.string('type', 30).notNullable().defaultTo('info')
                .comment('info, warning, success, error, action_required');
            table.timestamp('read_at').nullable();
            table.string('link', 500).nullable()
                .comment('URL to redirect when clicked');
            addAuditColumns(table, knex);
        }),
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('notifications'),
        knex.schema.dropTableIfExists('audit_logs'),
    ]);
};
