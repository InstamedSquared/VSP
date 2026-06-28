const db = require('../../config/db');

// --- Invoices ---

exports.getInvoices = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'invoices.id', sortOrder = 'desc' } = req.query;

        const query = db('invoices')
            .leftJoin('clients', 'invoices.id_client', 'clients.id')
            .select(
                'invoices.*',
                'clients.fn as client_fn',
                'clients.sn as client_sn'
            );

        if (search) {
            query.where(builder => {
                builder.where('invoice_number', 'like', `%${search}%`)
                       .orWhere('clients.fn', 'like', `%${search}%`)
                       .orWhere('clients.sn', 'like', `%${search}%`);
            });
        }

        const countQuery = query.clone().clearSelect().count('invoices.id as total').first();
        const dataQuery = query.orderBy(sortBy, sortOrder).limit(limit).offset((page - 1) * limit);

        const [countResult, data] = await Promise.all([countQuery, dataQuery]);
        
        res.status(200).json({ success: true, total: countResult.total, data });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const data = await db('invoices')
            .leftJoin('clients', 'invoices.id_client', 'clients.id')
            .select(
                'invoices.*',
                'clients.fn as client_fn',
                'clients.sn as client_sn'
            ).where('invoices.id', req.params.id).first();
        
        if (!data) return res.status(404).json({ success: false, message: 'Invoice not found' });
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createInvoice = async (req, res) => {
    try {
        const data = { ...req.body };
        // Generate automatic invoice number if not provided
        if (!data.invoice_number) {
            const count = await db('invoices').count('id as total').first();
            data.invoice_number = `INV-${new Date().getFullYear()}-${String(count.total + 1).padStart(4, '0')}`;
        }
        
        const [id] = await db('invoices').insert(data);
        res.status(201).json({ success: true, message: 'Invoice created', id });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        await db('invoices').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Invoice updated' });
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        await db('invoices').where({ id: req.params.id }).delete();
        res.status(200).json({ success: true, message: 'Invoice deleted' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Invoice Line Items ---

const recalculateInvoiceTotals = async (invoiceId) => {
    const lineItems = await db('invoice_line_items').where({ id_invoice: invoiceId });
    const subtotal = lineItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    
    // Flat tax rate 7.65%
    const taxRate = 0.0765;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    await db('invoices').where({ id: invoiceId }).update({
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    });
};

exports.getInvoiceLineItems = async (req, res) => {
    try {
        const { page = 1, limit = 100 } = req.query; // Usually show all line items
        const invoiceId = req.params.id;

        const data = await db('invoice_line_items')
            .leftJoin('employees', 'invoice_line_items.id_employee', 'employees.id')
            .select(
                'invoice_line_items.*',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn'
            )
            .where('invoice_line_items.id_invoice', invoiceId)
            .orderBy('invoice_line_items.id', 'asc')
            .limit(limit).offset((page - 1) * limit);

        const countQuery = await db('invoice_line_items').where('id_invoice', invoiceId).count('id as total').first();

        res.status(200).json({ success: true, total: countQuery.total, data });
    } catch (error) {
        console.error('Error fetching line items:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.addInvoiceLineItem = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const data = { ...req.body, id_invoice: invoiceId };
        
        // Auto-calculate amount if hours and rate are provided
        if (data.hours && data.rate) {
            data.amount = parseFloat(data.hours) * parseFloat(data.rate);
        }

        const [id] = await db('invoice_line_items').insert(data);
        
        // Recalculate invoice totals
        await recalculateInvoiceTotals(invoiceId);

        res.status(201).json({ success: true, message: 'Line item added', id });
    } catch (error) {
        console.error('Error adding line item:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateInvoiceLineItem = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const lineItemId = req.params.lineItemId;
        const data = { ...req.body };
        
        if (data.hours && data.rate) {
            data.amount = parseFloat(data.hours) * parseFloat(data.rate);
        }

        await db('invoice_line_items').where({ id: lineItemId, id_invoice: invoiceId }).update(data);
        
        await recalculateInvoiceTotals(invoiceId);

        res.status(200).json({ success: true, message: 'Line item updated' });
    } catch (error) {
        console.error('Error updating line item:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteInvoiceLineItem = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const lineItemId = req.params.lineItemId;

        await db('invoice_line_items').where({ id: lineItemId, id_invoice: invoiceId }).delete();
        
        await recalculateInvoiceTotals(invoiceId);

        res.status(200).json({ success: true, message: 'Line item deleted' });
    } catch (error) {
        console.error('Error deleting line item:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Payrolls ---

exports.getPayrolls = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'payrolls.id', sortOrder = 'desc', period_start_from, period_start_to } = req.query;

        const query = db('payrolls')
            .leftJoin('employees', 'payrolls.id_employee', 'employees.id')
            .select(
                'payrolls.*',
                'employees.fn as employee_fn',
                'employees.sn as employee_sn'
            );

        if (search) {
            query.where(builder => {
                builder.where('employees.fn', 'like', `%${search}%`)
                       .orWhere('employees.sn', 'like', `%${search}%`);
            });
        }
        
        if (period_start_from) {
            query.andWhere('period_start', '>=', period_start_from);
        }
        
        if (period_start_to) {
            const toDate = new Date(period_start_to);
            toDate.setDate(toDate.getDate() + 1);
            query.andWhere('period_start', '<=', toDate);
        }

        const countQuery = query.clone().clearSelect().count('payrolls.id as total').first();
        
        // Ensure sortBy defaults to a valid column if not provided
        const sortColumn = sortBy === 'id' ? 'payrolls.id' : sortBy;
        const dataQuery = query.orderBy(sortColumn, sortOrder).limit(limit).offset((page - 1) * limit);

        const [countResult, data] = await Promise.all([countQuery, dataQuery]);
        
        res.status(200).json({ success: true, totalRecords: parseInt(countResult.total), data });
    } catch (error) {
        console.error('Error fetching payrolls:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createPayroll = async (req, res) => {
    try {
        const data = { ...req.body };
        
        const [id] = await db('payrolls').insert(data);
        res.status(201).json({ success: true, message: 'Payroll created', id });
    } catch (error) {
        console.error('Error creating payroll:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updatePayroll = async (req, res) => {
    try {
        const data = { ...req.body };
        const id = req.params.id;

        await db('payrolls').where({ id }).update(data);
        res.status(200).json({ success: true, message: 'Payroll updated' });
    } catch (error) {
        console.error('Error updating payroll:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deletePayroll = async (req, res) => {
    try {
        // Assume soft-delete or hard delete. If the app usually does soft-delete, we can do it here. 
        // For now, let's hard-delete since it's just a basic CRUD.
        await db('payrolls').where({ id: req.params.id }).delete();
        res.status(200).json({ success: true, message: 'Payroll deleted' });
    } catch (error) {
        console.error('Error deleting payroll:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
