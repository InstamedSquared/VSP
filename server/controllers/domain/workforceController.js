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

