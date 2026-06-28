const db = require('../../config/db');

exports.getStaffAssignments = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'client_staff_assignments.id', sortOrder = 'desc' } = req.query;

        const query = db('client_staff_assignments')
            .join('clients', 'client_staff_assignments.id_client', 'clients.id')
            .join('employees', 'client_staff_assignments.id_employee', 'employees.id');

        if (search) {
            query.andWhere(builder => {
                builder.where('clients.fn', 'like', `%${search}%`)
                       .orWhere('clients.sn', 'like', `%${search}%`)
                       .orWhere('employees.fn', 'like', `%${search}%`)
                       .orWhere('employees.sn', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().count('client_staff_assignments.id as total').first();
        const { total } = await countQuery;
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .select(
                'client_staff_assignments.id',
                'client_staff_assignments.id_client',
                'client_staff_assignments.id_employee',
                'client_staff_assignments.start_date',
                'client_staff_assignments.end_date',
                'client_staff_assignments.status',
                'client_staff_assignments.hourly_rate',
                'client_staff_assignments.monthly_rate',
                'client_staff_assignments.billing_type',
                'clients.fn as client_fn',
                'clients.sn as client_sn',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn',
                'employees.email as employee_email'
            )
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset(offset);

        res.status(200).json({ data, totalRecords });
    } catch (error) {
        console.error('Error fetching staff assignments:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createStaffAssignment = async (req, res) => {
    try {
        console.log('--- createStaffAssignment ---');
        console.log('req.user:', req.user);
        console.log('req.body before:', req.body);
        const data = { ...req.body };
        
        const fs = require('fs');
        const isAdmin = req.user?.t === '0' || req.user?.t === 0 || req.user?.userType === '0';
        fs.appendFileSync('debug_log.txt', `\n--- createStaffAssignment ---\nreq.user: ${JSON.stringify(req.user)}\nreq.body: ${JSON.stringify(req.body)}\nisAdmin: ${isAdmin}\n`);
        
        if (!isAdmin) {
            delete data.hourly_rate;
            delete data.monthly_rate;
        } else {
            if (data.hourly_rate === '') data.hourly_rate = null;
            if (data.monthly_rate === '') data.monthly_rate = null;
        }

        if (data.start_date === '') data.start_date = null;
        if (data.end_date === '') data.end_date = null;

        console.log('data to insert:', data);

        const [id] = await db('client_staff_assignments').insert(data);
        res.status(201).json({ success: true, message: 'Assignment created successfully', id });
    } catch (error) {
        console.error('Error creating staff assignment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateStaffAssignment = async (req, res) => {
    try {
        console.log('--- updateStaffAssignment ---');
        console.log('req.user:', req.user);
        console.log('req.body before:', req.body);
        const data = { ...req.body };
        const id = req.params.id;

        const fs = require('fs');
        const isAdmin = req.user?.t === '0' || req.user?.t === 0 || req.user?.userType === '0';
        fs.appendFileSync('debug_log.txt', `\n--- updateStaffAssignment ---\nreq.user: ${JSON.stringify(req.user)}\nreq.body: ${JSON.stringify(req.body)}\nisAdmin: ${isAdmin}\n`);
        
        // If not admin, do not update billing data
        if (!isAdmin) {
            delete data.hourly_rate;
            delete data.monthly_rate;
        } else {
            if (data.hourly_rate === '') data.hourly_rate = null;
            if (data.monthly_rate === '') data.monthly_rate = null;
        }

        if (data.start_date === '') data.start_date = null;
        if (data.end_date === '') data.end_date = null;

        console.log('data to update:', data);

        await db('client_staff_assignments').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Assignment updated successfully' });
    } catch (error) {
        console.error('Error updating staff assignment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteStaffAssignment = async (req, res) => {
    try {
        // Just hard delete or soft delete (the table has status 'ended')
        await db('client_staff_assignments').where({ id: req.params.id }).update({
            status: 'ended'
        });
        res.status(200).json({ success: true, message: 'Assignment ended successfully' });
    } catch (error) {
        console.error('Error ending staff assignment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const fs = require('fs');
const path = require('path');

exports.getComplianceRecords = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'compliance_records.id', sortOrder = 'desc' } = req.query;

        const query = db('compliance_records')
            .join('employees', 'compliance_records.id_employee', 'employees.id')
            .select(
                'compliance_records.*',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn',
                'employees.email as employee_email'
            );

        if (search) {
            query.where(builder => {
                builder.where('employees.fn', 'like', `%${search}%`)
                       .orWhere('employees.sn', 'like', `%${search}%`)
                       .orWhere('compliance_type', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().clearSelect().count('compliance_records.id as total').first();
        const dataQuery = query.orderBy(sortBy, sortOrder).limit(limit).offset((page - 1) * limit);

        const [countResult, data] = await Promise.all([countQuery, dataQuery]);
        
        res.status(200).json({ success: true, total: countResult.total, data });
    } catch (error) {
        console.error('Error fetching compliance records:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createComplianceRecord = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.due_date === '') data.due_date = null;
        if (data.completed_at === '') data.completed_at = null;
        
        if (req.file) {
            const destFolder = path.join(__dirname, '../../../private_storage/compliance');
            if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
            
            const newFilename = `${Date.now()}_${req.file.originalname}`;
            fs.renameSync(req.file.path, path.join(destFolder, newFilename));
            data.document_path = newFilename;
        }

        const [id] = await db('compliance_records').insert(data);
        res.status(201).json({ success: true, message: 'Compliance record created', id });
    } catch (error) {
        console.error('Error creating compliance record:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateComplianceRecord = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        if (data.due_date === '') data.due_date = null;
        if (data.completed_at === '') data.completed_at = null;

        if (req.file) {
            const destFolder = path.join(__dirname, '../../../private_storage/compliance');
            if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
            
            const newFilename = `${Date.now()}_${req.file.originalname}`;
            fs.renameSync(req.file.path, path.join(destFolder, newFilename));
            data.document_path = newFilename;
            
            // Delete old file
            const oldRecord = await db('compliance_records').select('document_path').where({ id }).first();
            if (oldRecord && oldRecord.document_path) {
                const oldPath = path.join(destFolder, oldRecord.document_path);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        await db('compliance_records').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Compliance record updated' });
    } catch (error) {
        console.error('Error updating compliance record:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteComplianceRecord = async (req, res) => {
    try {
        const id = req.params.id;
        const oldRecord = await db('compliance_records').select('document_path').where({ id }).first();
        if (oldRecord && oldRecord.document_path) {
            const oldPath = path.join(__dirname, '../../../private_storage/compliance', oldRecord.document_path);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        await db('compliance_records').where({ id }).delete();
        res.status(200).json({ success: true, message: 'Compliance record deleted' });
    } catch (error) {
        console.error('Error deleting compliance record:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.downloadComplianceDoc = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await db('compliance_records').select('document_path').where({ id }).first();
        if (!record || !record.document_path) return res.status(404).send('Document not found');
        
        const docPath = path.join(__dirname, '../../../private_storage/compliance', record.document_path);
        if (!fs.existsSync(docPath)) return res.status(404).send('File not found on server');
        
        res.download(docPath);
    } catch (error) {
        console.error('Error downloading doc:', error);
        res.status(500).send('Server Error');
    }
};

