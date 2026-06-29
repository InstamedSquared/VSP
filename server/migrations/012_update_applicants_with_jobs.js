exports.up = function(knex) {
    return knex.schema.alterTable('applicants', (table) => {
        table.integer('id_job_posting').unsigned().nullable().index();
        // We will not set a strict foreign key constraint yet to avoid breaking any existing loose applicant data,
        // but we index it for quick lookup.
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('applicants', (table) => {
        table.dropColumn('id_job_posting');
    });
};
