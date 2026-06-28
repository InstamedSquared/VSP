const express = require('express');
const { requirePermission } = require('../../middleware/rbacMiddleware');
const recruitmentController = require('../../controllers/domain/recruitmentController');
const upload = require('../../middleware/uploadMiddleware'); // Changed to use disk storage middleware

const router = express.Router();

// Applicants CRUD
router.get('/applicants', requirePermission('recruitment', 'read'), recruitmentController.getApplicants);
router.post('/applicants', requirePermission('recruitment', 'write'), upload.single('photo'), recruitmentController.createApplicant);
router.put('/applicants/:id', requirePermission('recruitment', 'write'), upload.single('photo'), recruitmentController.updateApplicant);
router.patch('/applicants/:id/delete', requirePermission('recruitment', 'delete'), recruitmentController.deleteApplicant);

// Photo Endpoint
router.get('/applicants/:id/photo', recruitmentController.getPhoto);

// Pipeline CRUD
router.get('/pipeline', requirePermission('recruitment', 'read'), recruitmentController.getPipeline);
router.post('/pipeline', requirePermission('recruitment', 'write'), upload.none(), recruitmentController.createPipeline);
router.put('/pipeline/:id', requirePermission('recruitment', 'write'), upload.none(), recruitmentController.updatePipeline);
router.patch('/pipeline/:id/delete', requirePermission('recruitment', 'delete'), recruitmentController.deletePipeline);

module.exports = router;
