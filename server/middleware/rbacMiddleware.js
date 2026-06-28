const redisClient = require('../config/redis');
const db = require('../config/db');

/**
 * Middleware to enforce Role-Based Access Control (RBAC).
 * Checks if the logged-in user has the required permission (module + action).
 * Caches permissions in Redis for 15 minutes to reduce DB load.
 * 
 * @param {string} moduleName - The name of the module (e.g., 'workforce', 'billing')
 * @param {string} action - The action required (e.g., 'read', 'write', 'delete')
 */
exports.requirePermission = (moduleName, action) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id || !req.user.t) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const { id: userId, t: userType } = req.user;
            const prefix = process.env.REDIS_PREFIX || '';
            const cacheKey = `${prefix}user_perms:${userType}:${userId}`;

            let userPerms = null;
            const cachedPerms = await redisClient.get(cacheKey);

            if (cachedPerms) {
                userPerms = JSON.parse(cachedPerms);
            } else {
                // Fetch roles and permissions from the database
                const perms = await db('user_roles')
                    .join('role_permissions', 'user_roles.id_role', 'role_permissions.id_role')
                    .join('permissions', 'role_permissions.id_permission', 'permissions.id')
                    .where({
                        'user_roles.id_user': userId,
                        'user_roles.user_type': userType,
                        'user_roles.inactive': 0,
                        'role_permissions.inactive': 0,
                        'permissions.inactive': 0
                    })
                    .select('permissions.module', 'permissions.action');

                // Map to a simpler structure for fast lookup
                userPerms = {};
                perms.forEach(p => {
                    if (!userPerms[p.module]) {
                        userPerms[p.module] = [];
                    }
                    if (!userPerms[p.module].includes(p.action)) {
                        userPerms[p.module].push(p.action);
                    }
                });

                // Cache for 15 minutes (900 seconds)
                await redisClient.set(cacheKey, JSON.stringify(userPerms), { EX: 900 });
            }

            // Check if user has the specific module + action
            const modulePerms = userPerms[moduleName] || [];
            if (!modulePerms.includes(action)) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have the required permissions for this action.'
                });
            }

            next();
        } catch (error) {
            console.error('RBAC Middleware Error:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error validating permissions' });
        }
    };
};
