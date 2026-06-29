const db = require('../../config/db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

const processPhoto = async (file, id) => {
    if (!file) return null;
    const targetDir = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'applicants', String(id), 'profile');
    await fs.mkdir(targetDir, { recursive: true });
    
    // Cleanup old files
    const existingFiles = await fs.readdir(targetDir).catch(() => []);
    for (const old of existingFiles) await fs.unlink(path.join(targetDir, old));

    const finalName = `${path.parse(file.originalname).name}.webp`;
    const finalPath = path.join(targetDir, finalName);

    await sharp(file.path)
        .resize({ width: 400, fit: 'cover' })
        .toFormat('webp', { quality: 95 })
        .toFile(finalPath);
    
    await fs.unlink(file.path).catch(() => {});
    return finalName;
};

exports.getApplicants = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'desc' } = req.query;
        
        const query = db('applicants')
            .leftJoin('job_postings', 'applicants.id_job_posting', 'job_postings.id')
            .leftJoin('recruitment_stages', function() {
                this.on('applicants.id', '=', 'recruitment_stages.id_applicant')
                    .andOn('recruitment_stages.inactive', '=', db.raw('?', [0]))
            })
            .where('applicants.inactive', 0);

        if (search) {
            query.andWhere(builder => {
                builder.where('applicants.fn', 'like', `%${search}%`)
                       .orWhere('applicants.sn', 'like', `%${search}%`)
                       .orWhere('applicants.email', 'like', `%${search}%`)
                       .orWhere('applicants.phone', 'like', `%${search}%`)
                       .orWhere('job_postings.title', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().count('applicants.id as total').first();
        const { total } = await countQuery;
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .select(
                'applicants.id', 'applicants.fn', 'applicants.mn', 'applicants.sn', 'applicants.email', 'applicants.phone', 
                'applicants.resume_path', 'applicants.source', 'applicants.status', 'applicants.gender', 'applicants.bday', 
                'applicants.photo_filename', 'applicants.remarks', 'job_postings.title as job_title', 'recruitment_stages.stage as pipeline_stage'
            )
            .orderBy(`applicants.${sortBy}`, sortOrder)
            .limit(limit)
            .offset(offset);

        const mappedData = data.map(item => ({
            ...item,
            photoUrl: item.photo_filename ? `/api/v1/recruitment/applicants/${item.id}/photo` : null
        }));

        res.status(200).json({ data: mappedData, totalRecords });
    } catch (error) {
        console.error('Error fetching applicants:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createApplicant = async (req, res) => {
    try {
        const data = { ...req.body, created_by: req.user?.id || null };
        const [id] = await db('applicants').insert(data);
        
        if (req.file) {
            const photo_filename = await processPhoto(req.file, id);
            await db('applicants').where({ id }).update({ photo_filename });
        }

        res.status(201).json({ success: true, message: 'Applicant created successfully', id });
    } catch (error) {
        console.error('Error creating applicant:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const processResume = async (file, id) => {
    if (!file) return null;
    const targetDir = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'applicants', String(id), 'resumes');
    await fs.mkdir(targetDir, { recursive: true });
    
    const finalName = file.originalname;
    const finalPath = path.join(targetDir, finalName);
    
    await fs.rename(file.path, finalPath).catch(async () => {
        // Fallback to copy/unlink if rename fails across devices
        await fs.copyFile(file.path, finalPath);
        await fs.unlink(file.path).catch(() => {});
    });
    return finalName;
};

exports.publicApply = async (req, res) => {
    try {
        const { fn, mn, sn, email, phone, gender, bday, id_job_posting, cover_letter } = req.body;
        
        if (!fn || !sn || !email) {
            return res.status(400).json({ success: false, message: 'First Name, Last Name, and Email are required.' });
        }

        const data = {
            fn, mn: mn || null, sn, email, phone,
            gender: gender || null,
            bday: bday || null,
            id_job_posting: id_job_posting || null,
            remarks: cover_letter || null,
            source: 'website',
            status: 'applied'
        };

        const [id] = await db('applicants').insert(data);
        
        if (req.file) {
            const resume_filename = await processResume(req.file, id);
            await db('applicants').where({ id }).update({ resume_path: resume_filename });
        }

        // Also add an initial pipeline stage
        await db('recruitment_stages').insert({
            id_applicant: id,
            stage: 'applied',
            notes: 'Application submitted via public website'
        });

        res.status(201).json({ success: true, message: 'Application submitted successfully', id });
    } catch (error) {
        console.error('Error processing public application:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateApplicant = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        const oldRecord = await db('applicants').where({ id }).first();
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

        if (req.file) {
            data.photo_filename = await processPhoto(req.file, id);
        }

        await db('applicants').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Applicant updated successfully' });
    } catch (error) {
        console.error('Error updating applicant:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteApplicant = async (req, res) => {
    try {
        await db('applicants').where({ id: req.params.id }).update({
            inactive: 1,
            deleted_by: req.user?.id,
            deleted_at: db.fn.now()
        });
        res.status(200).json({ success: true, message: 'Applicant deleted successfully' });
    } catch (error) {
        console.error('Error deleting applicant:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await db('applicants').where({ id }).select('photo_filename').first();
        if (!record || !record.photo_filename) return res.status(404).send('Photo not found');

        const photoPath = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'applicants', String(id), 'profile', record.photo_filename);
        if (fsSync.existsSync(photoPath)) {
            res.sendFile(photoPath);
        } else {
            res.status(404).send('Photo not found');
        }
    } catch (error) {
        console.error('Error getting photo:', error);
        res.status(500).send('Server Error');
    }
};

exports.getResume = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await db('applicants').where({ id }).select('resume_path').first();
        if (!record || !record.resume_path) return res.status(404).send('Resume not found');

        const resumePath = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'applicants', String(id), 'resumes', record.resume_path);
        if (fsSync.existsSync(resumePath)) {
            res.download(resumePath);
        } else {
            res.status(404).send('Resume not found');
        }
    } catch (error) {
        console.error('Error getting resume:', error);
        res.status(500).send('Server Error');
    }
};

// --- Employee Conversion ---
exports.convertApplicant = async (req, res) => {
    const trx = await db.transaction();
    try {
        const { id } = req.params;
        const applicant = await trx('applicants').where({ id, inactive: 0 }).first();
        
        if (!applicant) {
            await trx.rollback();
            return res.status(404).json({ success: false, message: 'Applicant not found or already inactive' });
        }

        // Generate temporary password
        const crypto = require('crypto');
        const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 char temp password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Insert into employees
        const [employeeId] = await trx('employees').insert({
            fn: applicant.fn,
            mn: applicant.mn,
            sn: applicant.sn,
            gender: applicant.gender,
            bday: applicant.bday,
            email: applicant.email,
            phone: applicant.phone,
            un: applicant.email, // Use email as username
            pw: hashedPassword,
            photo_filename: applicant.photo_filename,
            created_by: req.user?.id,
            created_at: db.fn.now()
        });

        // Insert resume into employee_documents if exists
        if (applicant.resume_path) {
            await trx('employee_documents').insert({
                id_employee: employeeId,
                document_type: 'resume',
                title: 'Application Resume',
                file_path: applicant.resume_path,
                created_by: req.user?.id,
                created_at: db.fn.now()
            });
        }

        // Mark applicant as inactive
        await trx('applicants').where({ id }).update({
            inactive: 1,
            changelog: JSON.stringify([{ timestamp: new Date().toISOString(), userId: req.user?.id, changes: { converted_to_employee: true, new_employee_id: employeeId } }])
        });

        // Also mark their pipeline record as inactive
        await trx('recruitment_stages').where({ id_applicant: id }).update({
            inactive: 1
        });

        await trx.commit();

        // Send welcome email
        const emailService = require('../../services/emailService');
        const fullName = `${applicant.fn} ${applicant.sn}`.trim();
        const emailResult = await emailService.sendWelcomeEmail(applicant.email, applicant.email, tempPassword, fullName);
        
        let msg = 'Applicant successfully converted to employee';
        if (emailResult.success) {
            msg += ' and welcome email sent.';
        } else {
            msg += ', but failed to send welcome email.';
            console.error('Email failed:', emailResult.error);
        }

        res.status(200).json({ 
            success: true, 
            message: msg,
            tempPassword: tempPassword,
            email: applicant.email
        });
    } catch (error) {
        await trx.rollback();
        console.error('Error converting applicant:', error);
        res.status(500).json({ success: false, message: 'Server Error during conversion' });
    }
};

// --- Pipeline Tracking ---

exports.getPipeline = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'recruitment_stages.id', sortOrder = 'desc' } = req.query;
        
        const query = db('recruitment_stages')
            .join('applicants', 'recruitment_stages.id_applicant', 'applicants.id')
            .where('recruitment_stages.inactive', 0);

        if (search) {
            query.andWhere(builder => {
                builder.where('applicants.fn', 'like', `%${search}%`)
                       .orWhere('applicants.sn', 'like', `%${search}%`)
                       .orWhere('recruitment_stages.stage', 'like', `%${search}%`)
                       .orWhere('recruitment_stages.interviewer', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().count('recruitment_stages.id as total').first();
        const { total } = await countQuery;
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .select(
                'recruitment_stages.id',
                'recruitment_stages.id_applicant',
                'recruitment_stages.stage',
                'recruitment_stages.notes',
                'recruitment_stages.interviewer',
                'recruitment_stages.scheduled_at',
                'recruitment_stages.completed_at',
                'applicants.fn as applicant_fn',
                'applicants.mn as applicant_mn',
                'applicants.sn as applicant_sn',
                'applicants.photo_filename'
            )
            .orderBy(sortBy, sortOrder)
            .limit(limit)
            .offset(offset);

        const mappedData = data.map(item => ({
            ...item,
            photoUrl: item.photo_filename ? `/api/v1/recruitment/applicants/${item.id_applicant}/photo` : null
        }));

        res.status(200).json({ data: mappedData, totalRecords });
    } catch (error) {
        console.error('Error fetching pipeline:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createPipeline = async (req, res) => {
    try {
        const data = { ...req.body, created_by: req.user?.id || null };
        const [id] = await db('recruitment_stages').insert(data);
        
        // Auto-sync status
        if (data.stage && data.id_applicant) {
            await db('applicants').where({ id: data.id_applicant }).update({ status: data.stage });
        }

        res.status(201).json({ success: true, message: 'Pipeline stage created successfully', id });
    } catch (error) {
        console.error('Error creating pipeline stage:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updatePipeline = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        const oldRecord = await db('recruitment_stages').where({ id }).first();
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

        await db('recruitment_stages').where({ id }).update(data);

        // Auto-sync status
        if (data.stage && data.id_applicant) {
            await db('applicants').where({ id: data.id_applicant }).update({ status: data.stage });
        } else if (data.stage && oldRecord.id_applicant) {
            await db('applicants').where({ id: oldRecord.id_applicant }).update({ status: data.stage });
        }

        res.status(200).json({ success: true, message: 'Pipeline stage updated successfully' });
    } catch (error) {
        console.error('Error updating pipeline stage:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deletePipeline = async (req, res) => {
    try {
        await db('recruitment_stages').where({ id: req.params.id }).update({
            inactive: 1,
            deleted_by: req.user?.id,
            deleted_at: db.fn.now()
        });
        res.status(200).json({ success: true, message: 'Pipeline stage deleted successfully' });
    } catch (error) {
        console.error('Error deleting pipeline stage:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
