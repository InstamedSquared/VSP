/**
 * Seed: Update settings to VSP identity
 */
exports.seed = async function(knex) {
    // Update system name
    await knex('settings')
        .where({ setting_key: 'system' })
        .update({ setting_value: 'VSP' });

    // Update site title
    await knex('settings')
        .where({ setting_key: 'title' })
        .update({ setting_value: 'VSP Workforce Management' });

    // Update subtitle
    await knex('settings')
        .where({ setting_key: 'subtitle' })
        .update({ setting_value: 'Vital Solution Partners - Workforce Management Platform' });
};
