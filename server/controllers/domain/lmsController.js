const db = require('../../config/db');

// --- Courses ---

exports.getCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'desc' } = req.query;

        const query = db('courses').where('inactive', 0);

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
        console.error('Error fetching courses:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const data = {
            ...req.body,
            created_by: req.user?.id || null,
        };
        // Checkboxes come as string 'true'/'false' or actual boolean
        data.is_required = data.is_required === 'true' || data.is_required === true ? 1 : 0;
        if (data.duration_hours === '') data.duration_hours = null;

        const [id] = await db('courses').insert(data);
        res.status(201).json({ success: true, message: 'Course created successfully', id });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        data.is_required = data.is_required === 'true' || data.is_required === true ? 1 : 0;
        if (data.duration_hours === '') data.duration_hours = null;

        const oldRecord = await db('courses').where({ id }).first();
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

        await db('courses').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Course updated successfully' });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await db('courses').where({ id: req.params.id }).update({
            inactive: 1,
            deleted_by: req.user?.id,
            deleted_at: db.fn.now()
        });
        res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Employee LMS ---

exports.getMyCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'desc' } = req.query;
        const employeeId = req.user.id;

        // Fetch all courses and their enrollment status for the employee
        const allCoursesQuery = db('courses')
            .leftJoin('course_enrollments', function() {
                this.on('courses.id', '=', 'course_enrollments.id_course')
                    .andOn('course_enrollments.id_employee', '=', db.raw('?', [employeeId]))
            })
            .where('courses.inactive', 0)
            .select(
                'courses.*',
                'course_enrollments.status as enrollment_status',
                'course_enrollments.progress_percent',
                'course_enrollments.score',
                db.raw('CASE WHEN course_enrollments.id IS NOT NULL THEN 1 ELSE 0 END as is_enrolled')
            )
            .orderBy('courses.category', 'asc')
            .orderBy('courses.sort_order', 'asc');

        const allCourses = await allCoursesQuery;

        // Calculate locks per category
        const categoryStatus = {};
        allCourses.forEach(c => {
            if (!categoryStatus[c.category]) {
                categoryStatus[c.category] = { previousCompleted: true }; // First course is always unlocked
            }
            
            c.is_locked = !categoryStatus[c.category].previousCompleted ? 1 : 0;
            
            // Update previousCompleted for the next course in this category
            categoryStatus[c.category].previousCompleted = (c.enrollment_status === 'completed');
        });

        // Now filter/sort/paginate the processed array in memory (since we needed full list for locking logic)
        let filtered = allCourses;
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(c => c.title && c.title.toLowerCase().includes(s));
        }

        const allowedCourseCols = ['id', 'title', 'category', 'duration_hours', 'is_required'];
        const sortCol = allowedCourseCols.includes(sortBy) ? sortBy : 'id';
        
        filtered.sort((a, b) => {
            let valA = a[sortCol];
            let valB = b[sortCol];
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        const totalRecords = filtered.length;
        const offset = (page - 1) * limit;
        const data = filtered.slice(offset, offset + Number(limit));

        res.status(200).json({ data, totalRecords });
    } catch (error) {
        console.error('Error fetching employee courses:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const employeeId = req.user.id;

        const existing = await db('course_enrollments').where({ id_course: courseId, id_employee: employeeId }).first();
        if (existing) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        await db('course_enrollments').insert({
            id_employee: employeeId,
            id_course: courseId,
            status: 'enrolled',
            progress_percent: 0,
            created_by: employeeId
        });

        res.status(200).json({ success: true, message: 'Successfully enrolled in course' });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMyProgress = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'enrolled_at', sortOrder = 'desc' } = req.query;
        const employeeId = req.user.id;

        const query = db('course_enrollments')
            .join('courses', 'course_enrollments.id_course', 'courses.id')
            .where('course_enrollments.id_employee', employeeId)
            .andWhere('courses.inactive', 0)
            .select(
                'course_enrollments.*',
                'courses.title',
                'courses.category',
                'courses.duration_hours'
            );

        if (search) {
            query.andWhere('courses.title', 'like', `%${search}%`);
        }

        const countQuery = db('course_enrollments')
            .join('courses', 'course_enrollments.id_course', 'courses.id')
            .where('course_enrollments.id_employee', employeeId)
            .andWhere('courses.inactive', 0);
        if (search) countQuery.andWhere('courses.title', 'like', `%${search}%`);
        const { total } = await countQuery.count('course_enrollments.id as total').first();
        const totalRecords = parseInt(total, 10);

        const allowedCourseCols = ['title', 'category', 'duration_hours'];
        const sortCol = allowedCourseCols.includes(sortBy) ? `courses.${sortBy}` : `course_enrollments.${sortBy}`;

        const offset = (page - 1) * limit;
        const data = await query.clone()
            .orderByRaw(`${sortCol} ${sortOrder}`)
            .limit(limit)
            .offset(offset);

        res.status(200).json({ data, totalRecords });
    } catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.completeCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const employeeId = req.user.id;

        const updated = await db('course_enrollments')
            .where({ id_course: courseId, id_employee: employeeId })
            .update({ status: 'completed', progress_percent: 100 });

        if (updated) {
            res.status(200).json({ success: true, message: 'Course marked as completed' });
        } else {
            res.status(404).json({ success: false, message: 'Enrollment not found' });
        }
    } catch (error) {
        console.error('Error completing course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const fs = require('fs');
const path = require('path');

const detectFileType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    if (['.mp4', '.avi', '.mov', '.wmv'].includes(ext)) return 'video';
    if (['.pdf'].includes(ext)) return 'pdf';
    if (['.doc', '.docx'].includes(ext)) return 'word';
    if (['.xls', '.xlsx', '.csv'].includes(ext)) return 'excel';
    if (['.ppt', '.pptx'].includes(ext)) return 'ppt';
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) return 'image';
    return 'other';
};

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

        if (data.length > 0) {
            const moduleIds = data.map(m => m.id);
            const files = await db('course_module_files').whereIn('id_course_module', moduleIds);
            data.forEach(m => {
                m.files = files.filter(f => f.id_course_module === m.id);
            });
        }

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
            file_type: 'other',
            duration_minutes: req.body.duration_minutes || null,
            created_by: req.user?.id || null,
        };

        const [id] = await db('course_modules').insert(data);
        
        if (req.files && req.files.length > 0) {
            const fileInserts = req.files.map(file => ({
                id_course_module: id,
                original_name: file.originalname,
                file_path: file.filename,
                file_type: detectFileType(file.originalname)
            }));
            await db('course_module_files').insert(fileInserts);
        }
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
            duration_minutes: req.body.duration_minutes || null,
        };

        await db('course_modules').where({ id }).update(data);
        
        if (req.files && req.files.length > 0) {
            const fileInserts = req.files.map(file => ({
                id_course_module: id,
                original_name: file.originalname,
                file_path: file.filename,
                file_type: detectFileType(file.originalname)
            }));
            await db('course_module_files').insert(fileInserts);
        }
        res.status(200).json({ success: true, message: 'Module updated successfully' });
    } catch (error) {
        console.error('Error updating module:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteCourseModule = async (req, res) => {
    try {
        const id = req.params.id;
        const files = await db('course_module_files').where({ id_course_module: id });
        
        // Delete actual files from disk
        files.forEach(f => {
            const oldPath = path.join(__dirname, '../../private_storage/lms', f.file_path);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        });

        await db('course_modules').where({ id }).del(); // Will cascade delete from course_module_files table if FK setup properly
        res.status(200).json({ success: true, message: 'Module deleted successfully' });
    } catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteCourseModuleFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await db('course_module_files').where({ id: fileId }).first();
        if (!file) return res.status(404).json({ success: false, message: 'File not found' });
        
        const oldPath = path.join(__dirname, '../../private_storage/lms', file.file_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        
        await db('course_module_files').where({ id: fileId }).del();
        res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
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

        if (data.length > 0) {
            const moduleIds = data.map(m => m.id);
            const files = await db('course_module_files').whereIn('id_course_module', moduleIds);
            data.forEach(m => {
                m.files = files.filter(f => f.id_course_module === m.id);
            });
        }

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
