/**
 * Seed: Default tenant for VSP (Vital Solution Partners)
 */
exports.seed = async function(knex) {
    // Only insert if not already present
    const existing = await knex('tenants').where({ id: 1 }).first();
    if (!existing) {
        await knex('tenants').insert({
            id: 1,
            name: 'Vital Solution Partners',
            slug: 'vsp',
            is_active: 1,
            tenant_id: 1,
            inactive: 0,
            archived: 0,
        });
    }
};
