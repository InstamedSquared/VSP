const express = require('express');
const { requirePermission } = require('../../middleware/rbacMiddleware');
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

module.exports = router;
