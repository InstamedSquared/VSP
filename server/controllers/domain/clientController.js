const db = require('../../config/db');

// --- Staffing ---
exports.getMyStaff = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { page = 1, limit = 10, search = '', sortBy = 'client_staff_assignments.id', sortOrder = 'desc' } = req.query;

        const query = db('client_staff_assignments')
            .join('employees', 'client_staff_assignments.id_employee', 'employees.id')
            .where({
                'client_staff_assignments.id_client': clientId,
                'client_staff_assignments.status': 'active'
            });

        if (search) {
            query.andWhere(builder => {
                builder.where('employees.fn', 'like', `%${search}%`)
                       .orWhere('employees.sn', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().clearSelect().count('client_staff_assignments.id as total').first();
        const { total } = await countQuery;
        
        const data = await query.clone()
            .select(
                'client_staff_assignments.id',
                'client_staff_assignments.start_date',
                'client_staff_assignments.end_date',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn',
                'employees.email as employee_email',
                'employees.photo_filename'
            )
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset((page - 1) * limit);

        res.status(200).json({ success: true, totalRecords: parseInt(total, 10), data });
    } catch (error) {
        console.error('Error fetching client staff:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMySkills = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { page = 1, limit = 10, search = '', sortBy = 'employee_skills.id', sortOrder = 'desc' } = req.query;

        const assignedEmployeesQuery = db('client_staff_assignments')
            .where({ id_client: clientId, status: 'active' })
            .select('id_employee');

        const query = db('employee_skills')
            .join('employees', 'employee_skills.id_employee', 'employees.id')
            .whereIn('employee_skills.id_employee', assignedEmployeesQuery)
            .where('employee_skills.inactive', 0);

        if (search) {
            query.andWhere(builder => {
                builder.where('employees.fn', 'like', `%${search}%`)
                       .orWhere('employees.sn', 'like', `%${search}%`)
                       .orWhere('employee_skills.skill_name', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().clearSelect().count('employee_skills.id as total').first();
        const { total } = await countQuery;
        
        const data = await query.clone()
            .select(
                'employee_skills.*',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn'
            )
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset((page - 1) * limit);

        res.status(200).json({ success: true, totalRecords: parseInt(total, 10), data });
    } catch (error) {
        console.error('Error fetching client skills:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMyLeaves = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        // Get leaves for employees assigned to this client
        const assignedEmployeesQuery = db('client_staff_assignments')
            .where({ id_client: clientId, status: 'active' })
            .select('id_employee');
            
        const query = db('leave_requests')
            .join('employees', 'leave_requests.id_employee', 'employees.id')
            .whereIn('leave_requests.id_employee', assignedEmployeesQuery);

        const countQuery = query.clone().clearSelect().count('leave_requests.id as total').first();
        const { total } = await countQuery;
        
        const data = await query.clone()
            .select(
                'leave_requests.*',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn'
            )
            .orderBy('leave_requests.start_date', 'desc')
            .limit(limit)
            .offset((page - 1) * limit);

        res.status(200).json({ success: true, totalRecords: parseInt(total, 10), data });
    } catch (error) {
        console.error('Error fetching client leaves:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateMyLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // should be 'approved' or 'rejected'
        const clientId = req.user.id;

        // Verify that this leave belongs to an employee assigned to the client
        const leave = await db('leave_requests').where({ id }).first();
        if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });

        const assignment = await db('client_staff_assignments')
            .where({ id_client: clientId, id_employee: leave.id_employee, status: 'active' })
            .first();

        if (!assignment) {
            return res.status(403).json({ success: false, message: 'Unauthorized to approve this leave' });
        }

        await db('leave_requests').where({ id }).update({
            status,
            approved_by: clientId,
            approved_at: db.fn.now()
        });

        res.status(200).json({ success: true, message: `Leave ${status} successfully` });
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMyReplacements = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const query = db('replacement_requests')
            .join('employees', 'replacement_requests.id_employee', 'employees.id')
            .leftJoin('employees as replacements', 'replacement_requests.id_replacement', 'replacements.id')
            .where({ 'replacement_requests.id_client': clientId });

        const countQuery = query.clone().clearSelect().count('replacement_requests.id as total').first();
        const { total } = await countQuery;
        
        const data = await query.clone()
            .select(
                'replacement_requests.*',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn',
                'replacements.fn as replacement_fn',
                'replacements.sn as replacement_sn'
            )
            .orderBy('replacement_requests.id', 'desc')
            .limit(limit)
            .offset((page - 1) * limit);

        res.status(200).json({ success: true, totalRecords: parseInt(total, 10), data });
    } catch (error) {
        console.error('Error fetching replacement requests:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createReplacementRequest = async (req, res) => {
    try {
        const data = { 
            ...req.body,
            id_client: req.user.id
        };

        const [id] = await db('replacement_requests').insert(data);
        res.status(201).json({ success: true, message: 'Replacement request submitted successfully', id });
    } catch (error) {
        console.error('Error creating replacement request:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateReplacementRequest = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        // Prevent client from updating admin-only fields like status or id_replacement
        delete data.status;
        delete data.id_replacement;
        delete data.resolved_at;

        await db('replacement_requests').where({ id, id_client: req.user.id }).update(data);
        res.status(200).json({ success: true, message: 'Replacement request updated' });
    } catch (error) {
        console.error('Error updating replacement request:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Billing ---
exports.getMyInvoices = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'desc' } = req.query;

        const query = db('invoices').where({ id_client: clientId });

        if (search) {
            query.andWhere('invoice_number', 'like', `%${search}%`);
        }

        const countQuery = query.clone().clearSelect().count('id as total').first();
        const { total } = await countQuery;
        
        const data = await query.clone()
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset((page - 1) * limit);

        res.status(200).json({ success: true, totalRecords: parseInt(total, 10), data });
    } catch (error) {
        console.error('Error fetching client invoices:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMyInvoiceById = async (req, res) => {
    try {
        const clientId = req.user.id;
        const data = await db('invoices').where({ id: req.params.id, id_client: clientId }).first();
        
        if (!data) return res.status(404).json({ success: false, message: 'Invoice not found' });
        
        // Also fetch line items
        const lineItems = await db('invoice_line_items')
            .leftJoin('employees', 'invoice_line_items.id_employee', 'employees.id')
            .select(
                'invoice_line_items.*',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn'
            )
            .where('invoice_line_items.id_invoice', data.id)
            .orderBy('invoice_line_items.id', 'asc');
            
        data.lineItems = lineItems;
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching invoice details:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMyPayments = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const query = db('payments')
            .leftJoin('invoices', 'payments.id_invoice', 'invoices.id')
            .where({ 'payments.id_client': clientId });

        const countQuery = query.clone().clearSelect().count('payments.id as total').first();
        const { total } = await countQuery;
        
        const data = await query.clone()
            .select(
                'payments.*',
                'invoices.invoice_number'
            )
            .orderBy('payments.id', 'desc')
            .limit(limit)
            .offset((page - 1) * limit);

        res.status(200).json({ success: true, totalRecords: parseInt(total, 10), data });
    } catch (error) {
        console.error('Error fetching client payments:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Training & Contracts ---
exports.getMyContracts = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const query = db('client_contracts').where({ id_client: clientId });

        const countQuery = query.clone().clearSelect().count('id as total').first();
        const { total } = await countQuery;
        
        const data = await query.clone()
            .orderBy('id', 'desc')
            .limit(limit)
            .offset((page - 1) * limit);

        res.status(200).json({ success: true, totalRecords: parseInt(total, 10), data });
    } catch (error) {
        console.error('Error fetching client contracts:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMyTraining = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const query = db('client_training_materials').where({ id_client: clientId });

        const countQuery = query.clone().clearSelect().count('id as total').first();
        const { total } = await countQuery;
        
        const data = await query.clone()
            .orderBy('id', 'desc')
            .limit(limit)
            .offset((page - 1) * limit);

        res.status(200).json({ success: true, totalRecords: parseInt(total, 10), data });
    } catch (error) {
        console.error('Error fetching client training materials:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
