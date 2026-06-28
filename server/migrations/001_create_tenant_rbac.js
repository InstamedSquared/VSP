const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return Promise.all([
        // Tenants — multi-tenant registry
        knex.schema.createTable('tenants', (table) => {
            table.increments('id').primary();
            table.string('slug', 50).notNullable().unique();
            table.boolean('is_active').notNullable().defaultTo(true);
            addAuditColumns(table, knex);
        }),

        // Roles — role definitions
        knex.schema.createTable('roles', (table) => {
            table.increments('id').primary();
            table.string('code', 20).notNullable().unique();
            table.string('description', 500).nullable();
            addAuditColumns(table, knex);
        }),

        // Permissions — module + action combos
        knex.schema.createTable('permissions', (table) => {
            table.increments('id').primary();
            table.string('module', 50).notNullable();
            table.string('action', 50).notNullable();
            table.string('description', 500).nullable();
            table.unique(['module', 'action']);
            addAuditColumns(table, knex);
        }),

        // Role-Permission mapping
        knex.schema.createTable('role_permissions', (table) => {
            table.increments('id').primary();
            table.integer('id_role').unsigned().notNullable()
                .references('id').inTable('roles').onDelete('CASCADE');
            table.integer('id_permission').unsigned().notNullable()
                .references('id').inTable('permissions').onDelete('CASCADE');
            table.unique(['id_role', 'id_permission']);
            addAuditColumns(table, knex);
        }),

        // User-Role assignment
        knex.schema.createTable('user_roles', (table) => {
            table.increments('id').primary();
            table.integer('id_user').unsigned().notNullable();
            table.string('user_type', 10).notNullable().defaultTo('0')
                .comment('0=admin, 1=employee, 2=client');
            table.integer('id_role').unsigned().notNullable()
                .references('id').inTable('roles').onDelete('CASCADE');
            table.unique(['id_user', 'user_type', 'id_role']);
            addAuditColumns(table, knex);
        }),
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('user_roles'),
        knex.schema.dropTableIfExists('role_permissions'),
        knex.schema.dropTableIfExists('permissions'),
        knex.schema.dropTableIfExists('roles'),
        knex.schema.dropTableIfExists('tenants'),
    ]);
};
