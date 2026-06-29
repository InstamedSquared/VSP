const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return Promise.all([
        // 1. Add sort_order to courses
        knex.schema.alterTable('courses', (table) => {
            table.integer('sort_order').notNullable().defaultTo(0);
        }),

        // 2. Add columns to course_modules
        knex.schema.alterTable('course_modules', (table) => {
            table.text('description').nullable();
            table.string('file_type', 50).nullable().comment('image, video, pdf, word, excel, ppt, other');
            table.string('file_path', 500).nullable();
            table.string('status', 30).notNullable().defaultTo('active').comment('active, inactive');
        }),

        // 3. Create module_progress table
        knex.schema.createTable('module_progress', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.integer('id_module').unsigned().notNullable()
                .references('id').inTable('course_modules').onDelete('CASCADE');
            table.string('status', 30).notNullable().defaultTo('pending').comment('pending, completed');
            table.timestamp('completed_at').nullable();
            table.unique(['id_employee', 'id_module']);
            addAuditColumns(table, knex);
        })
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('module_progress'),
        knex.schema.alterTable('course_modules', (table) => {
            table.dropColumn('description');
            table.dropColumn('file_type');
            table.dropColumn('file_path');
            table.dropColumn('status');
        }),
        knex.schema.alterTable('courses', (table) => {
            table.dropColumn('sort_order');
        })
    ]);
};
