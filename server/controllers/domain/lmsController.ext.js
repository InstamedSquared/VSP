const fs = require('fs');
const path = require('path');

// --- Course Modules (Admin) ---

exports.getCourseModules = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { page = 1, limit = 50, search = '', sortBy = 'sort_order', sortOrder = 'asc' } = req.query;

        const query = db('course_modules').where('id_course', courseId);
        
        if (search) {
            query.andWhere('title', 'like', `%${search}%`);
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
        console.error('Error fetching course modules:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createCourseModule = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const data = {
            id_course: courseId,
            title: req.body.title,
            description: req.body.description,
            sort_order: req.body.sort_order || 0,
            status: req.body.status || 'active',
            file_type: req.body.file_type || null,
            duration_minutes: req.body.duration_minutes || null,
            created_by: req.user?.id || null,
        };

        if (req.file) {
            data.file_path = req.file.filename;
        }

        const [id] = await db('course_modules').insert(data);
        res.status(201).json({ success: true, message: 'Module created successfully', id });
    } catch (error) {
        console.error('Error creating module:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateCourseModule = async (req, res) => {
    try {
        const id = req.params.id;
        const oldRecord = await db('course_modules').where({ id }).first();
        if (!oldRecord) return res.status(404).json({ success: false, message: 'Not found' });

        const data = {
            title: req.body.title,
            description: req.body.description,
            sort_order: req.body.sort_order || 0,
            status: req.body.status || 'active',
            file_type: req.body.file_type || null,
            duration_minutes: req.body.duration_minutes || null,
        };

        if (req.file) {
            data.file_path = req.file.filename;
            // Optionally delete old file
            if (oldRecord.file_path) {
                const oldPath = path.join(__dirname, '../../private_storage/lms', oldRecord.file_path);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        await db('course_modules').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Module updated successfully' });
    } catch (error) {
        console.error('Error updating module:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteCourseModule = async (req, res) => {
    try {
        const id = req.params.id;
        await db('course_modules').where({ id }).del();
        res.status(200).json({ success: true, message: 'Module deleted successfully' });
    } catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getCourseModuleFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../private_storage/lms', filename);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).json({ success: false, message: 'File not found' });
        }
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Employee Module Progression ---

exports.getEmployeeCourseModules = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const employeeId = req.user.id;
        const { page = 1, limit = 50, search = '', sortBy = 'sort_order', sortOrder = 'asc' } = req.query;

        const query = db('course_modules')
            .leftJoin('module_progress', function() {
                this.on('course_modules.id', '=', 'module_progress.id_module')
                    .andOn('module_progress.id_employee', '=', db.raw('?', [employeeId]))
            })
            .where('course_modules.id_course', courseId)
            .where('course_modules.status', 'active')
            .select(
                'course_modules.*',
                db.raw('IFNULL(module_progress.status, "pending") as progress_status'),
                'module_progress.completed_at'
            );

        if (search) {
            query.andWhere('course_modules.title', 'like', `%${search}%`);
        }

        const countQuery = db('course_modules').where('id_course', courseId).where('status', 'active');
        if (search) countQuery.andWhere('title', 'like', `%${search}%`);
        
        const { total } = await countQuery.count('id as total').first();
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .orderBy(`course_modules.${sortBy}`, sortOrder)
            .limit(limit)
            .offset(offset);

        res.status(200).json({ data, totalRecords });
    } catch (error) {
        console.error('Error fetching employee course modules:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.completeCourseModule = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const employeeId = req.user.id;

        const mod = await db('course_modules').where('id', moduleId).first();
        if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });

        const courseId = mod.id_course;

        // Ensure course is enrolled
        const enrollment = await db('course_enrollments').where({ id_course: courseId, id_employee: employeeId }).first();
        if (!enrollment) {
            return res.status(400).json({ success: false, message: 'You must enroll in the course first' });
        }

        // Upsert module_progress
        const existingProgress = await db('module_progress').where({ id_module: moduleId, id_employee: employeeId }).first();
        if (existingProgress) {
            await db('module_progress')
                .where('id', existingProgress.id)
                .update({ status: 'completed', completed_at: db.fn.now() });
        } else {
            await db('module_progress').insert({
                id_employee: employeeId,
                id_module: moduleId,
                status: 'completed',
                completed_at: db.fn.now()
            });
        }

        // Check if all modules for the course are completed
        const allModules = await db('course_modules').where({ id_course: courseId, status: 'active' });
        const completedModules = await db('module_progress')
            .join('course_modules', 'module_progress.id_module', 'course_modules.id')
            .where({ 'module_progress.id_employee': employeeId, 'course_modules.id_course': courseId, 'module_progress.status': 'completed', 'course_modules.status': 'active' });

        const isFullyCompleted = allModules.length > 0 && completedModules.length === allModules.length;
        const progressPercent = allModules.length > 0 ? Math.round((completedModules.length / allModules.length) * 100) : 0;

        await db('course_enrollments')
            .where('id', enrollment.id)
            .update({
                progress_percent: progressPercent,
                status: isFullyCompleted ? 'completed' : 'in_progress',
                completed_at: isFullyCompleted ? db.fn.now() : null
            });

        res.status(200).json({ 
            success: true, 
            message: 'Module completed successfully',
            course_completed: isFullyCompleted,
            progress_percent: progressPercent
        });
    } catch (error) {
        console.error('Error completing course module:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
