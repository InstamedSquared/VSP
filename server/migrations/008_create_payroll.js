const { addAuditColumns } = require('./utils/helpers');

exports.up = function(knex) {
    return Promise.all([
        // Payroll records
        knex.schema.createTable('payrolls', (table) => {
            table.increments('id').primary();
            table.integer('id_employee').unsigned().notNullable().index();
            table.date('period_start').notNullable();
            table.date('period_end').notNullable();
            table.decimal('gross_pay', 12, 2).notNullable().defaultTo(0);
            table.decimal('deductions', 12, 2).notNullable().defaultTo(0);
            table.decimal('net_pay', 12, 2).notNullable().defaultTo(0);
            table.string('status', 30).notNullable().defaultTo('draft')
                .comment('draft, processing, paid');
            table.date('payment_date').nullable();
            addAuditColumns(table, knex);
        })
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('payrolls')
    ]);
};
