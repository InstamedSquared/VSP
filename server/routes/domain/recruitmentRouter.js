const express = require('express');
const { requirePermission } = require('../../middleware/rbacMiddleware');
const recruitmentController = require('../../controllers/domain/recruitmentController');
const jobController = require('../../controllers/domain/jobController');
const upload = require('../../middleware/uploadMiddleware'); // Changed to use disk storage middleware

const router = express.Router();

// Public Jobs & Apply Endpoints
router.get('/public-jobs', jobController.getPublishedJobs);
router.post('/public-apply', upload.single('resume'), recruitmentController.publicApply);

// Jobs CRUD
router.get('/jobs', requirePermission('recruitment', 'read'), jobController.getJobs);
router.get('/jobs/:id', requirePermission('recruitment', 'read'), jobController.getJobById);
router.post('/jobs', requirePermission('recruitment', 'write'), upload.none(), jobController.createJob);
router.put('/jobs/:id', requirePermission('recruitment', 'write'), upload.none(), jobController.updateJob);
router.patch('/jobs/:id/delete', requirePermission('recruitment', 'delete'), jobController.deleteJob);

// Applicants CRUD
router.get('/applicants', requirePermission('recruitment', 'read'), recruitmentController.getApplicants);
router.post('/applicants', requirePermission('recruitment', 'write'), upload.single('photo'), recruitmentController.createApplicant);
router.put('/applicants/:id', requirePermission('recruitment', 'write'), upload.single('photo'), recruitmentController.updateApplicant);
router.patch('/applicants/:id/delete', requirePermission('recruitment', 'delete'), recruitmentController.deleteApplicant);

// Photo & Resume Endpoints
router.get('/applicants/:id/photo', recruitmentController.getPhoto);
router.get('/applicants/:id/resume', requirePermission('recruitment', 'read'), recruitmentController.getResume);

// Employee Conversion
router.post('/applicants/:id/convert', requirePermission('recruitment', 'write'), recruitmentController.convertApplicant);

// Pipeline CRUD
router.get('/pipeline', requirePermission('recruitment', 'read'), recruitmentController.getPipeline);
router.post('/pipeline', requirePermission('recruitment', 'write'), upload.none(), recruitmentController.createPipeline);
router.put('/pipeline/:id', requirePermission('recruitment', 'write'), upload.none(), recruitmentController.updatePipeline);
router.patch('/pipeline/:id/delete', requirePermission('recruitment', 'delete'), recruitmentController.deletePipeline);

module.exports = router;
