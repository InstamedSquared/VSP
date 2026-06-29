const express = require('express');
const { requirePermission } = require('../../middleware/rbacMiddleware');
const { protect, restrictTo } = require('../../middleware/authMiddleware');
const workforceController = require('../../controllers/domain/workforceController');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

// Dropdown Helper (requires basic workforce read)
router.get('/employees', requirePermission('workforce', 'read'), workforceController.getEmployeesForDropdown);

// Bench Status CRUD
router.get('/bench', requirePermission('workforce', 'read'), workforceController.getBenchStatus);
router.post('/bench', requirePermission('workforce', 'write'), upload.none(), workforceController.createBenchStatus);
router.put('/bench/:id', requirePermission('workforce', 'write'), upload.none(), workforceController.updateBenchStatus);
router.patch('/bench/:id/delete', requirePermission('workforce', 'delete'), workforceController.deleteBenchStatus);

// Skills Inventory CRUD
router.get('/skills', requirePermission('workforce', 'read'), workforceController.getSkills);
router.post('/skills', requirePermission('workforce', 'write'), upload.none(), workforceController.createSkill);
router.put('/skills/:id', requirePermission('workforce', 'write'), upload.none(), workforceController.updateSkill);
router.patch('/skills/:id/delete', requirePermission('workforce', 'delete'), workforceController.deleteSkill);

// Payslips (Read-Only — auto-populated from paid payrolls)
router.get('/payslips', requirePermission('workforce', 'read'), workforceController.getPayslips);

// Employee Documents (Admin)
router.get('/documents', requirePermission('workforce', 'read'), workforceController.getDocuments);
router.post('/documents', requirePermission('workforce', 'write'), upload.single('file'), workforceController.createDocument);
router.put('/documents/:id', requirePermission('workforce', 'write'), upload.single('file'), workforceController.updateDocument);
router.patch('/documents/:id/delete', requirePermission('workforce', 'delete'), workforceController.deleteDocument);

// --- Employee Self-Service Endpoints ---
router.get('/my-payslips', protect, restrictTo('1'), workforceController.getMyPayslips);
router.get('/my-leaves', protect, restrictTo('1'), workforceController.getMyLeaves);
router.post('/my-leaves', protect, restrictTo('1'), upload.none(), workforceController.createMyLeave);
router.put('/my-leaves/:id', protect, restrictTo('1'), upload.none(), workforceController.updateMyLeave);
router.delete('/my-leaves/:id', protect, restrictTo('1'), workforceController.deleteMyLeave);

// Employee Documents
router.get('/my-documents', protect, restrictTo('1'), workforceController.getMyDocuments);
router.post('/my-documents', protect, restrictTo('1'), upload.single('file'), workforceController.uploadMyDocument);
router.delete('/my-documents/:id', protect, restrictTo('1'), workforceController.deleteMyDocument);

// Reprofile Toggle
router.get('/my-bench', protect, restrictTo('1'), workforceController.getMyBenchStatus);
router.patch('/my-bench/reprofile', protect, restrictTo('1'), workforceController.toggleReprofile);

module.exports = router;
