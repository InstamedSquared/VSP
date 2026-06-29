const db = require('../../config/db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// --- Public Endpoint ---
exports.submitRequest = async (req, res) => {
    try {
        const { company_name, contact_person, email, phone, role_requested, requirements_notes } = req.body;

        if (!company_name || !contact_person || !email || !role_requested) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const data = {
            company_name,
            contact_person,
            email,
            phone,
            role_requested,
            requirements_notes,
            status: 'pending'
        };

        const [id] = await db('client_requests').insert(data);
        res.status(201).json({ success: true, message: 'Staffing request submitted successfully', id });
    } catch (error) {
        console.error('Error submitting client request:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Admin Endpoints ---
exports.getRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'desc', status = '' } = req.query;

        const query = db('client_requests').where({ inactive: 0 });

        if (status) {
            query.andWhere({ status });
        }

        if (search) {
            query.andWhere(builder => {
                builder.where('company_name', 'like', `%${search}%`)
                       .orWhere('contact_person', 'like', `%${search}%`)
                       .orWhere('email', 'like', `%${search}%`)
                       .orWhere('role_requested', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().count('id as total').first();
        const { total } = await countQuery;
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset(offset);

        res.status(200).json({ data, totalRecords });
    } catch (error) {
        console.error('Error fetching client requests:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateRequest = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        const oldRecord = await db('client_requests').where({ id }).first();
        if (!oldRecord) return res.status(404).json({ success: false, message: 'Not found' });

        // Special handling if status is changed to 'approved'
        if (data.status === 'approved' && oldRecord.status !== 'approved') {
            const updateData = { ...data };
            delete updateData.status; // approveRequest handles the status update
            
            if (Object.keys(updateData).length > 0) {
                await db('client_requests').where({ id }).update(updateData);
            }
            
            // Delegate entirely to approveRequest to create the client account and send email
            return exports.approveRequest(req, res);
        }

        // Normal update
        await db('client_requests').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Request updated successfully' });
    } catch (error) {
        console.error('Error updating client request:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        await db('client_requests').where({ id: req.params.id }).update({
            inactive: 1,
            deleted_by: req.user?.id,
            deleted_at: db.fn.now()
        });
        res.status(200).json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting client request:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.approveRequest = async (req, res) => {
    const trx = await db.transaction();
    try {
        const { id } = req.params;
        const request = await trx('client_requests').where({ id, inactive: 0 }).first();
        
        if (!request || request.status !== 'pending') {
            await trx.rollback();
            return res.status(400).json({ success: false, message: 'Request not found or not in pending status' });
        }

        // Check if client already exists
        const existingClient = await trx('clients').where({ un: request.email }).first();
        let tempPassword = null;

        if (!existingClient) {
            // 1. Generate temp password
            tempPassword = crypto.randomBytes(4).toString('hex');
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            // 2. Parse name
            const nameParts = request.contact_person.trim().split(' ');
            const fn = nameParts[0];
            const sn = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

            // 3. Create client record
            await trx('clients').insert({
                fn: fn,
                sn: sn,
                email: request.email,
                phone: request.phone,
                un: request.email,
                pw: hashedPassword,
                address: request.company_name,
                created_by: req.user?.id,
                created_at: db.fn.now()
            });
        }

        // 4. Update request status
        await trx('client_requests').where({ id }).update({
            status: 'approved'
        });

        await trx.commit();

        try {
            const sendEmail = require('../../utils/sendEmail');
            let emailHtml = '';
            
            if (tempPassword) {
                emailHtml = `
                    <h2>Welcome to Vital Solution Partners!</h2>
                    <p>Hello ${request.contact_person},</p>
                    <p>Your staffing request has been approved. An account has been created for you in our Client Portal.</p>
                    <p>Here are your login credentials:</p>
                    <p><strong>Username/Email:</strong> ${request.email}</p>
                    <p><strong>Password:</strong> ${tempPassword}</p>
                    <br/>
                    <p>Please log in and change your password as soon as possible.</p>
                `;
            } else {
                emailHtml = `
                    <h2>Update from Vital Solution Partners</h2>
                    <p>Hello ${request.contact_person},</p>
                    <p>Your new staffing request has been approved.</p>
                    <p>You can view the details by logging into your existing Client Portal account using your email (${request.email}).</p>
                `;
            }

            await sendEmail({
                email: request.email,
                subject: tempPassword ? 'VSP - Staffing Request Approved & Portal Account Created' : 'VSP - Staffing Request Approved',
                message: emailHtml
            });
        } catch (emailErr) {
            console.error('Error sending welcome email to approved client:', emailErr);
        }

        return res.status(200).json({ success: true, message: 'Request approved successfully' });
    } catch (err) {
        await trx.rollback();
        console.error('Error approving request:', err);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
