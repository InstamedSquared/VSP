const express = require('express');
const { requirePermission } = require('../../middleware/rbacMiddleware');
const { protect, restrictTo } = require('../../middleware/authMiddleware');
const lmsController = require('../../controllers/domain/lmsController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../../private_storage/lms');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
    }
});
const upload = multer({ storage: storage });
const uploadNone = multer().none();

const router = express.Router();

// Courses CRUD (Admin)
router.get('/courses', requirePermission('lms', 'read'), lmsController.getCourses);
router.post('/courses', requirePermission('lms', 'write'), uploadNone, lmsController.createCourse);
router.put('/courses/:id', requirePermission('lms', 'write'), uploadNone, lmsController.updateCourse);
router.patch('/courses/:id/delete', requirePermission('lms', 'delete'), lmsController.deleteCourse);

// Course Modules CRUD (Admin)
router.get('/courses/:courseId/modules', requirePermission('lms', 'read'), lmsController.getCourseModules);
router.post('/courses/:courseId/modules', requirePermission('lms', 'write'), upload.array('files', 10), lmsController.createCourseModule);
router.put('/courses/modules/:id', requirePermission('lms', 'write'), upload.array('files', 10), lmsController.updateCourseModule);
router.patch('/courses/modules/:id/delete', requirePermission('lms', 'delete'), lmsController.deleteCourseModule);
router.delete('/courses/modules/file/:fileId', requirePermission('lms', 'delete'), lmsController.deleteCourseModuleFile);
router.get('/courses/modules/file/:filename', protect, lmsController.getCourseModuleFile);

// Employee Endpoints
router.get('/my-courses', protect, restrictTo('1'), lmsController.getMyCourses);
router.post('/my-courses/:id/enroll', protect, restrictTo('1'), lmsController.enrollCourse);
router.get('/my-progress', protect, restrictTo('1'), lmsController.getMyProgress);
router.patch('/my-courses/:id/complete', protect, restrictTo('1'), lmsController.completeCourse);
router.get('/my-courses/:courseId/modules', protect, restrictTo('1'), lmsController.getEmployeeCourseModules);
router.patch('/my-courses/modules/:moduleId/complete', protect, restrictTo('1'), lmsController.completeCourseModule);

module.exports = router;
