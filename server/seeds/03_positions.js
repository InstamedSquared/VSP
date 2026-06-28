/**
 * Seed: VSP-specific positions added to user_position
 */
exports.seed = async function(knex) {
    const positions = [
        { name: 'HR Manager',              type: 1, remarks: 'Human Resources Management' },
        { name: 'Recruitment Specialist',   type: 1, remarks: 'Talent Acquisition' },
        { name: 'Finance Officer',          type: 1, remarks: 'Financial Operations' },
        { name: 'Operations Lead',          type: 1, remarks: 'Operations Management' },
        { name: 'Team Lead',               type: 2, remarks: 'Employee Team Leadership' },
    ];

    for (const pos of positions) {
        const exists = await knex('user_position').where({ name: pos.name }).first();
        if (!exists) {
            await knex('user_position').insert({
                ...pos,
                inactive: 0,
                archived: 0,
                created_by: 1,
            });
        }
    }
};
