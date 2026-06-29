const express = require('express');
const { protect, restrictTo } = require('../../middleware/authMiddleware');
const clientController = require('../../controllers/domain/clientController');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

// All routes are protected and restricted to client (type '2')
router.use(protect, restrictTo('2'));

// Staffing
router.get('/my-staff', clientController.getMyStaff);
router.get('/my-skills', clientController.getMySkills);
router.get('/my-leaves', clientController.getMyLeaves);
router.put('/my-leaves/:id', upload.none(), clientController.updateMyLeave);

router.get('/my-replacements', clientController.getMyReplacements);
router.post('/my-replacements', upload.none(), clientController.createReplacementRequest);
router.put('/my-replacements/:id', upload.none(), clientController.updateReplacementRequest);

// Billing
router.get('/my-invoices', clientController.getMyInvoices);
router.get('/my-invoices/:id', clientController.getMyInvoiceById);
router.get('/my-payments', clientController.getMyPayments);

// Training & Contracts
router.get('/my-contracts', clientController.getMyContracts);
router.get('/my-training', clientController.getMyTraining);

module.exports = router;
