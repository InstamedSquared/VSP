/**
 * Adds the standard audit columns to every table.
 * Called inside every migration's createTable callback.
 *
 * Follows the `trim` standard from instruction.md, with additions
 * for tenant_id and updated_at for new VSP tables.
 *
 * Columns added:
 *   name, remarks, tenant_id, inactive, archived, changelog,
 *   created_at, updated_at, created_by,
 *   deleted_at, deleted_by, archived_at, archived_by
 *
 * Usage:
 *   const { addAuditColumns } = require('./_helpers');
 *
 *   exports.up = function(knex) {
 *     return knex.schema.createTable('my_table', (table) => {
 *       table.increments('id').primary();
 *       // ... domain columns ...
 *       addAuditColumns(table, knex);  // Always last
 *     });
 *   };
 */
function addAuditColumns(table, knex) {
    table.string('name', 300).nullable();
    table.string('remarks', 500).nullable();
    table.integer('tenant_id').notNullable().defaultTo(1).index();
    table.smallint('inactive').defaultTo(0).index();
    table.smallint('archived').notNullable().defaultTo(0);
    table.text('changelog').nullable().defaultTo(null);
    table.integer('created_by', 10).unsigned().nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.integer('deleted_by', 12).unsigned().nullable();
    table.timestamp('deleted_at').nullable().defaultTo(null);
    table.integer('archived_by', 10).unsigned().nullable();
    table.timestamp('archived_at').nullable().defaultTo(null);
}

module.exports = { addAuditColumns };
