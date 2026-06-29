const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
  return knex.schema.createTable('client_requests', (table) => {
    table.increments('id').primary();
    table.string('company_name', 100).notNullable();
    table.string('contact_person', 100).notNullable();
    table.string('email', 100).notNullable();
    table.string('phone', 100).nullable();
    table.string('role_requested', 100).notNullable();
    table.text('requirements_notes').nullable();
    table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending').notNullable();
    addAuditColumns(table, knex);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('client_requests');
};
