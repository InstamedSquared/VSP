const db = require('../../config/db');

exports.getBenchStatus = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'bench_status.id', sortOrder = 'desc' } = req.query;
        
        const query = db('bench_status')
            .leftJoin('employees', 'bench_status.id_employee', 'employees.id')
            .where('bench_status.inactive', 0)
            .andWhere('employees.inactive', 0);

        if (search) {
            query.andWhere(builder => {
                builder.where('employees.fn', 'like', `%${search}%`)
                       .orWhere('employees.sn', 'like', `%${search}%`)
                       .orWhere('bench_status.status', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().count('bench_status.id as total').first();
        const { total } = await countQuery;
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .select(
                'bench_status.id',
                'bench_status.id_employee',
                'bench_status.status',
                'bench_status.available_date',
                'bench_status.notes',
                'employees.fn',
                'employees.sn',
                'employees.email'
            )
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset(offset);

        res.status(200).json({ data, totalRecords });
    } catch (error) {
        console.error('Error fetching bench status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createBenchStatus = async (req, res) => {
    try {
        const data = {
            ...req.body,
            created_by: req.user?.id || null,
        };
        const [id] = await db('bench_status').insert(data);
        res.status(201).json({ success: true, message: 'Status created successfully', id });
    } catch (error) {
        console.error('Error creating bench status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateBenchStatus = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        // Fetch old record for changelog
        const oldRecord = await db('bench_status').where({ id }).first();
        if (!oldRecord) return res.status(404).json({ success: false, message: 'Not found' });

        const excludedColumns = ['changelog', 'inactive'];
        const changes = {};
        for (const key in data) {
            if (!excludedColumns.includes(key) && String(oldRecord[key]) !== String(data[key])) {
                changes[key] = { from: oldRecord[key], to: data[key] };
            }
        }

        if (Object.keys(changes).length > 0) {
            let existing = [];
            try { existing = oldRecord.changelog ? JSON.parse(oldRecord.changelog) : []; } catch { existing = []; }
            existing.unshift({ timestamp: new Date().toISOString(), userId: req.user?.id, changes });
            data.changelog = JSON.stringify(existing);
        }

        await db('bench_status').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating bench status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteBenchStatus = async (req, res) => {
    try {
        await db('bench_status').where({ id: req.params.id }).update({
            inactive: 1,
            deleted_by: req.user?.id,
            deleted_at: db.fn.now()
        });
        res.status(200).json({ success: true, message: 'Status deleted successfully' });
    } catch (error) {
        console.error('Error deleting bench status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getEmployeesForDropdown = async (req, res) => {
    try {
        const employees = await db('employees')
            .where('inactive', 0)
            .select('id', 'fn', 'sn', 'email')
            .orderBy('sn', 'asc');
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Skills Inventory ---

exports.getSkills = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'employee_skills.id', sortOrder = 'desc' } = req.query;
        
        const query = db('employee_skills')
            .leftJoin('employees', 'employee_skills.id_employee', 'employees.id')
            .where('employee_skills.inactive', 0)
            .andWhere('employees.inactive', 0);

        if (search) {
            query.andWhere(builder => {
                builder.where('employees.fn', 'like', `%${search}%`)
                       .orWhere('employees.sn', 'like', `%${search}%`)
                       .orWhere('employee_skills.skill_name', 'like', `%${search}%`)
                       .orWhere('employee_skills.proficiency_level', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().count('employee_skills.id as total').first();
        const { total } = await countQuery;
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .select(
                'employee_skills.id',
                'employee_skills.id_employee',
                'employee_skills.skill_name',
                'employee_skills.proficiency_level',
                'employee_skills.years_experience',
                'employees.fn',
                'employees.sn',
                'employees.email'
            )
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset(offset);

        res.status(200).json({ data, totalRecords });
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createSkill = async (req, res) => {
    try {
        const data = {
            ...req.body,
            created_by: req.user?.id || null,
        };
        const [id] = await db('employee_skills').insert(data);
        res.status(201).json({ success: true, message: 'Skill added successfully', id });
    } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        const oldRecord = await db('employee_skills').where({ id }).first();
        if (!oldRecord) return res.status(404).json({ success: false, message: 'Not found' });

        const excludedColumns = ['changelog', 'inactive'];
        const changes = {};
        for (const key in data) {
            if (!excludedColumns.includes(key) && String(oldRecord[key]) !== String(data[key])) {
                changes[key] = { from: oldRecord[key], to: data[key] };
            }
        }

        if (Object.keys(changes).length > 0) {
            let existing = [];
            try { existing = oldRecord.changelog ? JSON.parse(oldRecord.changelog) : []; } catch { existing = []; }
            existing.unshift({ timestamp: new Date().toISOString(), userId: req.user?.id, changes });
            data.changelog = JSON.stringify(existing);
        }

        await db('employee_skills').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Skill updated successfully' });
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        await db('employee_skills').where({ id: req.params.id }).update({
            inactive: 1,
            deleted_by: req.user?.id,
            deleted_at: db.fn.now()
        });
        res.status(200).json({ success: true, message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Payslips (Read-Only view of paid payrolls) ---

exports.getPayslips = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'payrolls.id', sortOrder = 'desc', period_start_from, period_start_to } = req.query;
        
        const query = db('payrolls')
            .leftJoin('employees', 'payrolls.id_employee', 'employees.id')
            .where('payrolls.status', 'paid');

        if (search) {
            query.andWhere(builder => {
                builder.where('employees.fn', 'like', `%${search}%`)
                       .orWhere('employees.sn', 'like', `%${search}%`);
            });
        }

        if (period_start_from) {
            query.andWhere('payrolls.period_start', '>=', period_start_from);
        }
        if (period_start_to) {
            const toDate = new Date(period_start_to);
            toDate.setDate(toDate.getDate() + 1);
            query.andWhere('payrolls.period_start', '<=', toDate);
        }

        const countQuery = query.clone().count('payrolls.id as total').first();
        const { total } = await countQuery;
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .select(
                'payrolls.id',
                'payrolls.id_employee',
                'payrolls.period_start',
                'payrolls.period_end',
                'payrolls.gross_pay',
                'payrolls.deductions',
                'payrolls.net_pay',
                'payrolls.status',
                'payrolls.payment_date',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn'
            )
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset(offset);

        res.status(200).json({ data, totalRecords });
    } catch (error) {
        console.error('Error fetching payslips:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// --- Employee Documents (Admin) ---
exports.getDocuments = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const data = await db('employee_documents').where({ inactive: 0 }).limit(limit).offset(offset);
        const [{ total }] = await db('employee_documents').where({ inactive: 0 }).count('id as total');
        res.status(200).json({ data, totalRecords: parseInt(total) });
    } catch (e) { res.status(500).json({ success: false, message: 'Server Error' }); }
};
exports.createDocument = async (req, res) => {
    try {
        const file_path = req.file ? '/uploads/' + req.file.filename : null;
        await db('employee_documents').insert({ ...req.body, file_path, created_by: req.user.id });
        res.status(201).json({ success: true, message: 'Document created' });
    } catch (e) { res.status(500).json({ success: false, message: 'Server Error' }); }
};
exports.updateDocument = async (req, res) => {
    try {
        const updateData = { ...req.body, updated_at: db.fn.now() };
        if (req.file) updateData.file_path = '/uploads/' + req.file.filename;
        await db('employee_documents').where({ id: req.params.id }).update(updateData);
        res.status(200).json({ success: true, message: 'Document updated' });
    } catch (e) { res.status(500).json({ success: false, message: 'Server Error' }); }
};
exports.deleteDocument = async (req, res) => {
    try {
        await db('employee_documents').where({ id: req.params.id }).update({ inactive: 1, deleted_by: req.user.id, deleted_at: db.fn.now() });
        res.status(200).json({ success: true, message: 'Document deleted' });
    } catch (e) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

// --- Employee Self-Service Endpoints ---
exports.getMyPayslips = async (req, res) => {
    try {
        const data = await db('payrolls').where({ id_employee: req.user.id, inactive: 0 });
        res.status(200).json({ data, totalRecords: data.length });
    } catch (e) { res.status(500).json({ success: false }); }
};
exports.getMyLeaves = async (req, res) => {
    try {
        const data = await db('leave_requests').where({ id_employee: req.user.id, inactive: 0 });
        res.status(200).json({ data, totalRecords: data.length });
    } catch (e) { res.status(500).json({ success: false }); }
};
exports.createMyLeave = async (req, res) => {
    try {
        await db('leave_requests').insert({ ...req.body, id_employee: req.user.id, status: 'pending', created_by: req.user.id });
        res.status(201).json({ success: true, message: 'Leave requested' });
    } catch (e) { res.status(500).json({ success: false }); }
};
exports.updateMyLeave = async (req, res) => {
    try {
        await db('leave_requests').where({ id: req.params.id, id_employee: req.user.id }).update({ ...req.body, updated_at: db.fn.now() });
        res.status(200).json({ success: true, message: 'Leave updated' });
    } catch (e) { res.status(500).json({ success: false }); }
};
exports.deleteMyLeave = async (req, res) => {
    try {
        await db('leave_requests').where({ id: req.params.id, id_employee: req.user.id }).update({ inactive: 1, deleted_at: db.fn.now() });
        res.status(200).json({ success: true, message: 'Leave deleted' });
    } catch (e) { res.status(500).json({ success: false }); }
};

exports.getMyDocuments = async (req, res) => {
    try {
        const data = await db('employee_documents').where({ id_employee: req.user.id, inactive: 0 });
        res.status(200).json({ data, totalRecords: data.length });
    } catch (e) { res.status(500).json({ success: false }); }
};
exports.uploadMyDocument = async (req, res) => {
    try {
        const file_path = req.file ? '/uploads/' + req.file.filename : null;
        await db('employee_documents').insert({ ...req.body, id_employee: req.user.id, file_path, created_by: req.user.id });
        res.status(201).json({ success: true, message: 'Document uploaded' });
    } catch (e) { res.status(500).json({ success: false }); }
};
exports.deleteMyDocument = async (req, res) => {
    try {
        await db('employee_documents').where({ id: req.params.id, id_employee: req.user.id }).update({ inactive: 1, deleted_at: db.fn.now() });
        res.status(200).json({ success: true, message: 'Document deleted' });
    } catch (e) { res.status(500).json({ success: false }); }
};

// --- Reprofile Toggle ---
exports.toggleReprofile = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const { is_reprofiling } = req.body;
        const existingRecord = await db('bench_status').where({ id_employee: employeeId, inactive: 0 }).first();
        if (is_reprofiling) {
            if (!existingRecord) {
                await db('bench_status').insert({ id_employee: employeeId, status: 'available', available_date: db.fn.now(), notes: 'Requested via portal', created_by: employeeId });
            } else {
                await db('bench_status').where({ id: existingRecord.id }).update({ status: 'available', notes: 'Requested via portal', updated_at: db.fn.now() });
            }
        } else {
            if (existingRecord) {
                await db('bench_status').where({ id: existingRecord.id }).update({ inactive: 1, deleted_by: employeeId, deleted_at: db.fn.now() });
            }
        }
        res.status(200).json({ success: true, message: 'Reprofile status updated' });
    } catch (error) { res.status(500).json({ success: false }); }
};

exports.getMyBenchStatus = async (req, res) => {
    try {
        const existingRecord = await db('bench_status').where({ id_employee: req.user.id, inactive: 0 }).first();
        res.status(200).json({ success: true, data: existingRecord || null });
    } catch (error) { res.status(500).json({ success: false }); }
};
