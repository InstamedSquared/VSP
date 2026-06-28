const db = require('./config/db');

async function fixPermissions() {
    try {
        console.log('Inserting operations permissions...');
        const perms = [
            { module: 'operations', action: 'read', description: 'read access to operations module', tenant_id: 1 },
            { module: 'operations', action: 'write', description: 'write access to operations module', tenant_id: 1 },
            { module: 'operations', action: 'delete', description: 'delete access to operations module', tenant_id: 1 }
        ];

        for (const p of perms) {
            const exists = await db('permissions').where({ module: p.module, action: p.action }).first();
            if (!exists) {
                const [id] = await db('permissions').insert(p);
                console.log(`Inserted permission ID ${id}`);
                
                // Assign to Super Admin (role id 1)
                await db('role_permissions').insert({ id_role: 1, id_permission: id });
                // Assign to Operations Admin (role id 4)
                await db('role_permissions').insert({ id_role: 4, id_permission: id });
                console.log(`Assigned permission ID ${id} to roles 1 and 4`);
            }
        }
        console.log('Done!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixPermissions();
