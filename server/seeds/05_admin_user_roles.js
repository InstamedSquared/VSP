/**
 * Seed: Assign Super Admin role to existing admin user (id: 1)
 */
exports.seed = async function(knex) {
    const saRole = await knex('roles').where({ code: '0-SA' }).first();

    if (saRole) {
        const exists = await knex('user_roles')
            .where({ id_user: 1, user_type: '0', id_role: saRole.id })
            .first();

        if (!exists) {
            await knex('user_roles').insert({
                id_user: 1,
                user_type: '0',
                id_role: saRole.id,
                tenant_id: 1,
                inactive: 0,
                archived: 0,
            });
        }
    }
};
