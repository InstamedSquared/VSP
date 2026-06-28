const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return Promise.all([
        // Client invoices
        knex.schema.createTable('invoices', (table) => {
            table.increments('id').primary();
            table.integer('id_client').unsigned().notNullable().index();
            table.string('invoice_number', 50).notNullable().unique();
            table.date('period_start').notNullable();
            table.date('period_end').notNullable();
            table.decimal('subtotal', 12, 2).notNullable().defaultTo(0);
            table.decimal('tax', 12, 2).notNullable().defaultTo(0);
            table.decimal('total', 12, 2).notNullable().defaultTo(0);
            table.string('status', 30).notNullable().defaultTo('draft')
                .comment('draft, sent, paid, overdue, void');
            table.date('due_date').nullable();
            table.timestamp('paid_at').nullable();
            table.string('stripe_invoice_id', 100).nullable();
            addAuditColumns(table, knex);
        }),

        // Invoice line items
        knex.schema.createTable('invoice_line_items', (table) => {
            table.increments('id').primary();
            table.integer('id_invoice').unsigned().notNullable()
                .references('id').inTable('invoices').onDelete('CASCADE');
            table.string('description', 500).nullable();
            table.integer('id_employee').unsigned().nullable();
            table.decimal('hours', 8, 2).nullable();
            table.decimal('rate', 10, 2).nullable();
            table.decimal('amount', 12, 2).notNullable().defaultTo(0);
            addAuditColumns(table, knex);
        }),

        // Stripe payment records
        knex.schema.createTable('payments', (table) => {
            table.increments('id').primary();
            table.integer('id_invoice').unsigned().nullable()
                .references('id').inTable('invoices').onDelete('SET NULL');
            table.integer('id_client').unsigned().notNullable().index();
            table.decimal('amount', 12, 2).notNullable().defaultTo(0);
            table.string('currency', 10).notNullable().defaultTo('USD');
            table.string('stripe_payment_id', 100).nullable();
            table.string('status', 30).notNullable().defaultTo('pending')
                .comment('pending, succeeded, failed, refunded');
            table.timestamp('paid_at').nullable();
            addAuditColumns(table, knex);
        }),

        // Payroll batch processing
        knex.schema.createTable('payroll_runs', (table) => {
            table.increments('id').primary();
            table.date('period_start').notNullable();
            table.date('period_end').notNullable();
            table.decimal('total_amount', 14, 2).notNullable().defaultTo(0);
            table.string('status', 30).notNullable().defaultTo('draft')
                .comment('draft, processing, completed, cancelled');
            table.integer('processed_by').unsigned().nullable();
            table.timestamp('processed_at').nullable();
            addAuditColumns(table, knex);
        }),

        // Employee disbursement accounts (bank/wallet)
        knex.schema.createTable('disbursement_accounts', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.string('account_type', 30).notNullable().defaultTo('bank')
                .comment('bank, gcash, payoneer, wise');
            table.string('account_name', 200).nullable();
            table.string('account_number', 100).nullable();
            table.string('bank_name', 200).nullable();
            table.boolean('is_primary').notNullable().defaultTo(false);
            addAuditColumns(table, knex);
        }),

        // Time entries (Hubstaff sync)
        knex.schema.createTable('time_entries', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.integer('id_client').unsigned().nullable().index();
            table.date('date').notNullable();
            table.decimal('hours_worked', 6, 2).notNullable().defaultTo(0);
            table.integer('activity_percent').nullable();
            table.string('source', 20).notNullable().defaultTo('manual')
                .comment('hubstaff, manual');
            table.string('hubstaff_id', 50).nullable();
            addAuditColumns(table, knex);
        }),

        // Activity/productivity logs
        knex.schema.createTable('activity_logs', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.integer('id_time_entry').unsigned().nullable()
                .references('id').inTable('time_entries').onDelete('SET NULL');
            table.string('screenshot_url', 500).nullable();
            table.integer('activity_percent').nullable();
            table.timestamp('logged_at').defaultTo(knex.fn.now());
            addAuditColumns(table, knex);
        }),
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('activity_logs'),
        knex.schema.dropTableIfExists('time_entries'),
        knex.schema.dropTableIfExists('disbursement_accounts'),
        knex.schema.dropTableIfExists('payroll_runs'),
        knex.schema.dropTableIfExists('payments'),
        knex.schema.dropTableIfExists('invoice_line_items'),
        knex.schema.dropTableIfExists('invoices'),
    ]);
};
