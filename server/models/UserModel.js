const ResourceModel = require('./ResourceModel');
const db = require('../config/db');

class UserModel extends ResourceModel {
    // constructor(){ super({u:'users'}, {folderName:'users', subfolder:'profile'}); }
    constructor() { super('users'); }

    async userAuth(identifier) {
        const query = `
        SELECT * FROM (
            (SELECT id, un, pw, '0' as t FROM users WHERE inactive=0 AND un = ? ORDER BY id DESC LIMIT 1)
            UNION ALL
            (SELECT id, un, pw, '1' as t FROM employees WHERE inactive=0 AND un = ? ORDER BY id DESC LIMIT 1)
            UNION ALL
            (SELECT id, un, pw, '2' as t FROM clients WHERE inactive=0 AND un = ? ORDER BY id DESC LIMIT 1)
        ) as combined LIMIT 1`;

        const bindings = [identifier, identifier, identifier];
        const results = await this.query(query, bindings);

        return results.length > 0 ? results[0] : null;
    }

    async userActive(userId, userType = 0) {

        const userKind = userType === '0' ? 'admin' : userType === '1' ? 'employee' : 'client';
        const userTable = userType === '0' ? 'users' : userType === '1' ? 'employees' : 'clients';

        const model = new ResourceModel({ u: userTable }, { folderName: userTable, subfolder: 'profile' });
        const columns = ['u.id', 'u.fn', 'u.mn', 'u.sn', db.raw(`'${userKind}' AS kind`), db.raw('p.name as position'), 'u.gender', 'u.bday', 'u.phone', 'u.email', 'u.address', 'u.un', 'u.sidebar', 'u.dark', 'u.photo_filename', 'u.otp', 'u.event', 'u.notification'];
        const joins = [{ type: 'left', table: { p: 'user_position' }, on: ['u.id_position', '=', 'p.id'] }];

        const options = { joins: joins, withPhotoUrl: true, toSql: false };
        const [user] = await model.select(columns, { 'u.id': userId }, options);

        const settingsModel = new ResourceModel('settings');
        const settingsRaw = await settingsModel.select(['setting_key', 'setting_value'], { inactive: 0, archived: 0 });

        const settings = settingsRaw.reduce((acc, current) => {
            let value = current.setting_value;
            try {
                // Try to parse JSON for arrays/objects
                if (value && (typeof value === 'string') && (value.trim().startsWith('[') || value.trim().startsWith('{'))) {
                    value = JSON.parse(value);
                }
            } catch (e) {
                // Keep as string if parsing fails
            }
            acc[current.setting_key] = value;
            return acc;
        }, {});

        let extendedData = {};

        if (userType === '1') { // Employee
            extendedData.bench_status = await db('bench_status').where({ id_employee: userId, inactive: 0 }).orderBy('id', 'desc').first() || null;
            extendedData.skills = await db('employee_skills').where({ id_employee: userId, inactive: 0 }).select('skill_name', 'proficiency_level', 'years_experience');
        } else if (userType === '2') { // Client
            extendedData.contracts = await db('client_contracts').where({ id_client: userId, inactive: 0, status: 'active' }).select('contract_type', 'title', 'effective_date', 'expiry_date');
            extendedData.training_materials = await db('client_training_materials').where({ id_client: userId, inactive: 0 }).select('title', 'file_type');
        }

        const appData = { user: { ...user, ...extendedData }, settings: settings };

        return appData;
    }

    async userEmail(identifier) {
        const query = `
        (SELECT id, email, un, fn, mn, sn, '0' as t FROM users WHERE inactive=0 AND email = ? )
        UNION ALL
        (SELECT id, email, un, fn, mn, sn, '1' as t FROM employees WHERE inactive=0 AND email = ? )
        UNION ALL
        (SELECT id, email, un, fn, mn, sn, '2' as t FROM clients WHERE inactive=0 AND email = ? )
        LIMIT 1 `;

        const bindings = [identifier, identifier, identifier];
        const results = await this.query(query, bindings);

        return results.length > 0 ? results[0] : null;
    }
    async userResetVerify(userId, userType = 0) {
        const userTable = userType === '0' ? 'users' : userType === '1' ? 'employees' : 'clients';
        const query = `SELECT id FROM ${userTable} WHERE inactive=0 AND id = ? LIMIT 1 `;

        const bindings = [userId];
        const results = await this.query(query, bindings);

        return results.length > 0 ? results[0] : null;
    }

}

module.exports = new UserModel(); 