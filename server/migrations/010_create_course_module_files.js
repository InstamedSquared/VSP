exports.up = function(knex) {
    return knex.schema.createTable('course_module_files', function(table) {
        table.increments('id').primary();
        table.integer('id_course_module').unsigned().notNullable();
        table.foreign('id_course_module').references('course_modules.id').onDelete('CASCADE');
        table.string('original_name').notNullable();
        table.string('file_path').notNullable();
        table.enu('file_type', ['video', 'pdf', 'word', 'excel', 'ppt', 'image', 'other']).defaultTo('other');
        table.timestamps(true, true);
    }).then(() => {
        // Migrate existing data
        return knex.raw(`
            INSERT INTO course_module_files (id_course_module, original_name, file_path, file_type, created_at, updated_at)
            SELECT id, file_path, file_path, file_type, created_at, updated_at
            FROM course_modules
            WHERE file_path IS NOT NULL AND file_path != ''
        `);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('course_module_files');
};
