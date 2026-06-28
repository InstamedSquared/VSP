const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return Promise.all([
        // Employee documents (resumes, IDs, certs)
        knex.schema.createTable('employee_documents', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.string('document_type', 50).notNullable()
                .comment('resume, government_id, certification, contract, emergency_contact');
            table.string('title', 300).nullable();
            table.string('file_path', 500).nullable();
            table.date('expiry_date').nullable();
            addAuditColumns(table, knex);
        }),

        // Employee skills inventory
        knex.schema.createTable('employee_skills', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.string('skill_name', 100).notNullable();
            table.string('proficiency_level', 30).nullable()
                .comment('beginner, intermediate, advanced, expert');
            table.integer('years_experience').nullable();
            addAuditColumns(table, knex);
        }),

        // Bench status (floating/available tracking)
        knex.schema.createTable('bench_status', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.string('status', 30).notNullable().defaultTo('available')
                .comment('available, floating, partial, cross_trained, backup');
            table.date('available_date').nullable();
            table.text('notes').nullable();
            addAuditColumns(table, knex);
        }),

        // LMS course catalog
        knex.schema.createTable('courses', (table) => {
            table.increments('id').primary();
            table.string('title', 300).nullable();
            table.text('description').nullable();
            table.string('category', 50).nullable()
                .comment('hipaa, dental, insurance, billing, customer_service, internal');
            table.integer('duration_hours').nullable();
            table.boolean('is_required').notNullable().defaultTo(false);
            addAuditColumns(table, knex);
        }),

        // Course content modules
        knex.schema.createTable('course_modules', (table) => {
            table.increments('id').primary();
            table.integer('id_course').unsigned().notNullable()
                .references('id').inTable('courses').onDelete('CASCADE');
            table.string('title', 300).nullable();
            table.text('content').nullable()
                .comment('Rich text content via Tiptap');
            table.integer('sort_order').notNullable().defaultTo(0);
            table.integer('duration_minutes').nullable();
            addAuditColumns(table, knex);
        }),

        // Employee course enrollments & progress
        knex.schema.createTable('course_enrollments', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.integer('id_course').unsigned().notNullable()
                .references('id').inTable('courses').onDelete('CASCADE');
            table.string('status', 30).notNullable().defaultTo('enrolled')
                .comment('enrolled, in_progress, completed, failed');
            table.integer('progress_percent').notNullable().defaultTo(0);
            table.decimal('score', 5, 2).nullable();
            table.timestamp('enrolled_at').defaultTo(knex.fn.now());
            table.timestamp('completed_at').nullable();
            addAuditColumns(table, knex);
        }),

        // Payslips
        knex.schema.createTable('payslips', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.date('period_start').notNullable();
            table.date('period_end').notNullable();
            table.decimal('gross_pay', 12, 2).notNullable().defaultTo(0);
            table.decimal('deductions', 12, 2).notNullable().defaultTo(0);
            table.decimal('net_pay', 12, 2).notNullable().defaultTo(0);
            table.string('status', 20).notNullable().defaultTo('draft')
                .comment('draft, released, void');
            table.string('file_path', 500).nullable();
            addAuditColumns(table, knex);
        }),
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('payslips'),
        knex.schema.dropTableIfExists('course_enrollments'),
        knex.schema.dropTableIfExists('course_modules'),
        knex.schema.dropTableIfExists('courses'),
        knex.schema.dropTableIfExists('bench_status'),
        knex.schema.dropTableIfExists('employee_skills'),
        knex.schema.dropTableIfExists('employee_documents'),
    ]);
};
