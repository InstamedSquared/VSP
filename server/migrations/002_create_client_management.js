const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return Promise.all([
        // Client-Staff assignments
        knex.schema.createTable('client_staff_assignments', (table) => {
            table.increments('id').primary();
            table.integer('id_client').unsigned().notNullable().index();
            table.integer('id_employee').unsigned().notNullable().index();
            table.date('start_date').nullable();
            table.date('end_date').nullable();
            table.string('status', 30).notNullable().defaultTo('active')
                .comment('active, ended, on_hold');
            table.decimal('hourly_rate', 10, 2).nullable();
            table.decimal('monthly_rate', 12, 2).nullable();
            table.string('billing_type', 20).notNullable().defaultTo('hourly')
                .comment('hourly, monthly');
            addAuditColumns(table, knex);
        }),

        // Client contracts (MSA, NDA, BAA, SOW)
        knex.schema.createTable('client_contracts', (table) => {
            table.increments('id').primary();
            table.integer('id_client').unsigned().notNullable().index();
            table.string('contract_type', 30).notNullable()
                .comment('msa, nda, baa, sow, staffing');
            table.string('title', 300).nullable();
            table.string('file_path', 500).nullable();
            table.date('effective_date').nullable();
            table.date('expiry_date').nullable();
            table.string('status', 30).notNullable().defaultTo('active')
                .comment('draft, active, expired, terminated');
            addAuditColumns(table, knex);
        }),

        // Client training materials (SOPs, videos)
        knex.schema.createTable('client_training_materials', (table) => {
            table.increments('id').primary();
            table.integer('id_client').unsigned().notNullable().index();
            table.string('title', 300).nullable();
            table.string('file_path', 500).nullable();
            table.string('file_type', 30).nullable()
                .comment('pdf, video, document, link');
            table.text('description').nullable();
            addAuditColumns(table, knex);
        }),

        // Staff replacement requests
        knex.schema.createTable('replacement_requests', (table) => {
            table.increments('id').primary();
            table.integer('id_client').unsigned().notNullable().index();
            table.integer('id_employee').unsigned().notNullable().index()
                .comment('Employee being replaced');
            table.text('reason').nullable();
            table.string('urgency', 20).notNullable().defaultTo('normal')
                .comment('low, normal, high, emergency');
            table.string('status', 30).notNullable().defaultTo('pending')
                .comment('pending, in_progress, resolved, cancelled');
            table.integer('id_replacement').unsigned().nullable()
                .comment('Replacement employee ID');
            table.timestamp('resolved_at').nullable();
            addAuditColumns(table, knex);
        }),

        // Leave requests
        knex.schema.createTable('leave_requests', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.integer('id_client').unsigned().nullable().index();
            table.string('leave_type', 30).notNullable()
                .comment('vacation, sick, personal, emergency');
            table.date('start_date').notNullable();
            table.date('end_date').notNullable();
            table.string('status', 20).notNullable().defaultTo('pending')
                .comment('pending, approved, rejected, cancelled');
            table.integer('approved_by').unsigned().nullable();
            table.timestamp('approved_at').nullable();
            addAuditColumns(table, knex);
        }),
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('leave_requests'),
        knex.schema.dropTableIfExists('replacement_requests'),
        knex.schema.dropTableIfExists('client_training_materials'),
        knex.schema.dropTableIfExists('client_contracts'),
        knex.schema.dropTableIfExists('client_staff_assignments'),
    ]);
};
