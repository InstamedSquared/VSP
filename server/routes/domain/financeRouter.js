const express = require('express');
const { requirePermission } = require('../../middleware/rbacMiddleware');
const financeController = require('../../controllers/domain/financeController');
const multer = require('multer');
const upload = multer(); // For multipart form parsing without files

const router = express.Router();

// Invoices CRUD
router.get('/invoices', requirePermission('finance', 'read'), financeController.getInvoices);
router.get('/invoices/:id', requirePermission('finance', 'read'), financeController.getInvoiceById);
router.post('/invoices', requirePermission('finance', 'write'), upload.none(), financeController.createInvoice);
router.put('/invoices/:id', requirePermission('finance', 'write'), upload.none(), financeController.updateInvoice);
router.patch('/invoices/:id/delete', requirePermission('finance', 'delete'), financeController.deleteInvoice);

// Invoice Line Items
router.get('/invoices/:id/line-items', requirePermission('finance', 'read'), financeController.getInvoiceLineItems);
router.post('/invoices/:id/line-items', requirePermission('finance', 'write'), upload.none(), financeController.addInvoiceLineItem);
router.put('/invoices/:id/line-items/:lineItemId', requirePermission('finance', 'write'), upload.none(), financeController.updateInvoiceLineItem);
// Payrolls CRUD
router.get('/payrolls', requirePermission('finance', 'read'), financeController.getPayrolls);
router.post('/payrolls', requirePermission('finance', 'write'), upload.none(), financeController.createPayroll);
router.put('/payrolls/:id', requirePermission('finance', 'write'), upload.none(), financeController.updatePayroll);
router.patch('/payrolls/:id/delete', requirePermission('finance', 'delete'), financeController.deletePayroll);

module.exports = router;
