/**
 * Seed: Roles, permissions, and role-permission mappings
 */
exports.seed = async function(knex) {
    // --- Roles ---
    const roles = [
        { id: 1, code: '0-SA',  name: 'Super Admin',      description: 'Full system access' },
        { id: 2, code: '0-HR',  name: 'HR Admin',          description: 'Human resources and recruitment management' },
        { id: 3, code: '0-FIN', name: 'Finance Admin',     description: 'Billing, payroll, and financial operations' },
        { id: 4, code: '0-OPS', name: 'Operations Admin',  description: 'Day-to-day operations and compliance' },
    ];

    for (const role of roles) {
        const exists = await knex('roles').where({ code: role.code }).first();
        if (!exists) {
            await knex('roles').insert({
                ...role,
                tenant_id: 1,
                inactive: 0,
                archived: 0,
            });
        }
    }

    // --- Permissions ---
    const modules = ['workforce', 'billing', 'recruitment', 'compliance', 'lms', 'reports'];
    const actions = ['read', 'write', 'delete'];

    const permissions = [];
    let permId = 1;
    for (const mod of modules) {
        for (const action of actions) {
            permissions.push({
                id: permId++,
                module: mod,
                action: action,
                description: `${action} access to ${mod} module`,
            });
        }
    }

    for (const perm of permissions) {
        const exists = await knex('permissions').where({ module: perm.module, action: perm.action }).first();
        if (!exists) {
            await knex('permissions').insert({
                ...perm,
                tenant_id: 1,
                inactive: 0,
                archived: 0,
            });
        }
    }

    // --- Role-Permission Mappings ---
    // Super Admin gets ALL permissions
    const allPerms = await knex('permissions').select('id').where({ inactive: 0 });
    const saRole = await knex('roles').where({ code: '0-SA' }).first();

    if (saRole) {
        for (const perm of allPerms) {
            const exists = await knex('role_permissions')
                .where({ id_role: saRole.id, id_permission: perm.id }).first();
            if (!exists) {
                await knex('role_permissions').insert({
                    id_role: saRole.id,
                    id_permission: perm.id,
                    tenant_id: 1,
                    inactive: 0,
                    archived: 0,
                });
            }
        }
    }

    // HR Admin: workforce (all), recruitment (all), compliance (read/write), lms (all)
    const hrRole = await knex('roles').where({ code: '0-HR' }).first();
    if (hrRole) {
        const hrModules = {
            workforce: ['read', 'write', 'delete'],
            recruitment: ['read', 'write', 'delete'],
            compliance: ['read', 'write'],
            lms: ['read', 'write', 'delete'],
            reports: ['read'],
        };
        for (const [mod, acts] of Object.entries(hrModules)) {
            for (const action of acts) {
                const perm = await knex('permissions').where({ module: mod, action }).first();
                if (perm) {
                    const exists = await knex('role_permissions')
                        .where({ id_role: hrRole.id, id_permission: perm.id }).first();
                    if (!exists) {
                        await knex('role_permissions').insert({
                            id_role: hrRole.id,
                            id_permission: perm.id,
                            tenant_id: 1,
                            inactive: 0,
                            archived: 0,
                        });
                    }
                }
            }
        }
    }

    // Finance Admin: billing (all), reports (all), workforce (read)
    const finRole = await knex('roles').where({ code: '0-FIN' }).first();
    if (finRole) {
        const finModules = {
            billing: ['read', 'write', 'delete'],
            reports: ['read', 'write'],
            workforce: ['read'],
        };
        for (const [mod, acts] of Object.entries(finModules)) {
            for (const action of acts) {
                const perm = await knex('permissions').where({ module: mod, action }).first();
                if (perm) {
                    const exists = await knex('role_permissions')
                        .where({ id_role: finRole.id, id_permission: perm.id }).first();
                    if (!exists) {
                        await knex('role_permissions').insert({
                            id_role: finRole.id,
                            id_permission: perm.id,
                            tenant_id: 1,
                            inactive: 0,
                            archived: 0,
                        });
                    }
                }
            }
        }
    }

    // Operations Admin: compliance (all), workforce (read/write), reports (read)
    const opsRole = await knex('roles').where({ code: '0-OPS' }).first();
    if (opsRole) {
        const opsModules = {
            compliance: ['read', 'write', 'delete'],
            workforce: ['read', 'write'],
            reports: ['read'],
        };
        for (const [mod, acts] of Object.entries(opsModules)) {
            for (const action of acts) {
                const perm = await knex('permissions').where({ module: mod, action }).first();
                if (perm) {
                    const exists = await knex('role_permissions')
                        .where({ id_role: opsRole.id, id_permission: perm.id }).first();
                    if (!exists) {
                        await knex('role_permissions').insert({
                            id_role: opsRole.id,
                            id_permission: perm.id,
                            tenant_id: 1,
                            inactive: 0,
                            archived: 0,
                        });
                    }
                }
            }
        }
    }
};
