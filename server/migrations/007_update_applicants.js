exports.up = function(knex) {
    return knex.schema.alterTable('applicants', function(table) {
        table.string('gender', 10).nullable();
        table.date('bday').nullable();
        table.string('photo_filename', 255).nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('applicants', function(table) {
        table.dropColumn('gender');
        table.dropColumn('bday');
        table.dropColumn('photo_filename');
    });
};
