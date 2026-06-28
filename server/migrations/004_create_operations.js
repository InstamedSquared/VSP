const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return Promise.all([
        // Recruitment applicants
        knex.schema.createTable('applicants', (table) => {
            table.increments('id').primary();
            table.string('fn', 50).nullable();
            table.string('mn', 50).nullable();
            table.string('sn', 50).nullable();
            table.string('email', 100).nullable();
            table.string('phone', 50).nullable();
            table.string('resume_path', 500).nullable();
            table.string('source', 50).nullable()
                .comment('website, referral, job_board, social_media');
            table.string('status', 30).notNullable().defaultTo('applied')
                .comment('applied, screening, assessment, interview, client_interview, hired, pool, reprofile, rejected');
            addAuditColumns(table, knex);
        }),

        // Recruitment pipeline stages
        knex.schema.createTable('recruitment_stages', (table) => {
            table.increments('id').primary();
            table.integer('id_applicant').unsigned().notNullable()
                .references('id').inTable('applicants').onDelete('CASCADE');
            table.string('stage', 30).notNullable()
                .comment('applied, screening, assessment, interview, client_interview, hired, pool, reprofile');
            table.text('notes').nullable();
            table.string('interviewer', 100).nullable();
            table.timestamp('scheduled_at').nullable();
            table.timestamp('completed_at').nullable();
            addAuditColumns(table, knex);
        }),

        // Company announcements
        knex.schema.createTable('announcements', (table) => {
            table.increments('id').primary();
            table.string('title', 300).nullable();
            table.text('content').nullable();
            table.string('target_audience', 30).notNullable().defaultTo('all')
                .comment('all, admin, employees, clients, department');
            table.string('priority', 20).notNullable().defaultTo('normal')
                .comment('low, normal, high, urgent');
            table.timestamp('published_at').nullable();
            table.timestamp('expires_at').nullable();
            addAuditColumns(table, knex);
        }),

        // Announcement acknowledgments
        knex.schema.createTable('announcement_acks', (table) => {
            table.increments('id').primary();
            table.integer('id_announcement').unsigned().notNullable()
                .references('id').inTable('announcements').onDelete('CASCADE');
            table.integer('id_user').unsigned().notNullable();
            table.string('user_type', 10).notNullable().defaultTo('0')
                .comment('0=admin, 1=employee, 2=client');
            table.timestamp('acknowledged_at').defaultTo(knex.fn.now());
            addAuditColumns(table, knex);
        }),

        // Compliance records
        knex.schema.createTable('compliance_records', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.string('compliance_type', 50).notNullable()
                .comment('hipaa, nda, device_check, internet_redundancy, training, policy_ack');
            table.string('status', 30).notNullable().defaultTo('pending')
                .comment('pending, compliant, non_compliant, expired');
            table.date('due_date').nullable();
            table.timestamp('completed_at').nullable();
            table.string('document_path', 500).nullable();
            addAuditColumns(table, knex);
        }),
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('compliance_records'),
        knex.schema.dropTableIfExists('announcement_acks'),
        knex.schema.dropTableIfExists('announcements'),
        knex.schema.dropTableIfExists('recruitment_stages'),
        knex.schema.dropTableIfExists('applicants'),
    ]);
};
