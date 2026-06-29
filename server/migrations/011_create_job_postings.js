const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return knex.schema.createTable('job_postings', (table) => {
        table.increments('id').primary();
        table.string('title', 300).notNullable();
        table.string('department', 150).nullable();
        table.string('location', 150).nullable();
        table.string('employment_type', 50).nullable().comment('full_time, part_time, contract, freelance');
        table.text('description').nullable();
        table.text('requirements').nullable();
        table.string('salary_range', 100).nullable();
        table.string('status', 50).notNullable().defaultTo('draft').comment('draft, published, closed');
        addAuditColumns(table, knex);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('job_postings');
};
