const db = require('../../config/db');

// Get all jobs (Admin View)
exports.getJobs = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id || 1;
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'desc', status } = req.query;

        const query = db('job_postings')
            .where({ tenant_id: tenantId, inactive: 0 });

        if (status) query.andWhere({ status });

        if (search) {
            query.andWhere(builder => {
                builder.where('title', 'like', `%${search}%`)
                       .orWhere('department', 'like', `%${search}%`)
                       .orWhere('location', 'like', `%${search}%`);
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
        console.error('Error fetching jobs:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get public published jobs (Career Page)
exports.getPublishedJobs = async (req, res) => {
    try {
        // Public endpoint, maybe don't enforce tenant if it's a multi-tenant global page, 
        // but for VSP, usually it's tenant 1 or we infer tenant from subdomain. For now hardcode tenant 1 or fetch all.
        // Actually we will fetch all published jobs for the current tenant.
        // Wait, public routes might not have req.user. We'll default to tenant_id = 1.
        const tenantId = 1; 

        const data = await db('job_postings')
            .where({ tenant_id: tenantId, inactive: 0, status: 'published' })
            .orderBy('created_at', 'desc');

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching published jobs:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await db('job_postings').where({ id, inactive: 0 }).first();
        if (!data) return res.status(404).json({ success: false, message: 'Job not found' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createJob = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id || 1;
        const data = {
            ...req.body,
            tenant_id: tenantId,
            created_by: req.user.id
        };
        const [id] = await db('job_postings').insert(data);
        res.status(201).json({ success: true, message: 'Job created successfully', id });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const id = req.params.id;
        const data = { ...req.body };
        
        await db('job_postings').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Job updated successfully' });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const id = req.params.id;
        await db('job_postings').where({ id }).update({
            inactive: 1,
            deleted_by: req.user.id,
            deleted_at: db.fn.now()
        });
        res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
