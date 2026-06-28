const express = require('express');
const { requirePermission } = require('../../middleware/rbacMiddleware');
const operationsController = require('../../controllers/domain/operationsController');
const multer = require('multer');
const upload = multer(); // For multipart form parsing without files
const docUpload = require('../../middleware/docUploadMiddleware');

const router = express.Router();

// Staff Assignments CRUD
router.get('/assignments', requirePermission('operations', 'read'), operationsController.getStaffAssignments);
router.post('/assignments', requirePermission('operations', 'write'), upload.none(), operationsController.createStaffAssignment);
router.put('/assignments/:id', requirePermission('operations', 'write'), upload.none(), operationsController.updateStaffAssignment);
router.patch('/assignments/:id/delete', requirePermission('operations', 'delete'), operationsController.deleteStaffAssignment);

// Compliance CRUD
router.get('/compliance', requirePermission('compliance', 'read'), operationsController.getComplianceRecords);
router.post('/compliance', requirePermission('compliance', 'write'), docUpload.single('document'), operationsController.createComplianceRecord);
router.put('/compliance/:id', requirePermission('compliance', 'write'), docUpload.single('document'), operationsController.updateComplianceRecord);
router.patch('/compliance/:id/delete', requirePermission('compliance', 'delete'), operationsController.deleteComplianceRecord);
router.get('/compliance/:id/download', requirePermission('compliance', 'read'), operationsController.downloadComplianceDoc);

module.exports = router;
