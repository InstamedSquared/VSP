import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import DataTable from '../../../components/common/DataTable';
import { icons } from '../../../config/icons';
import Icon from '../../../components/common/Icon';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect } from '../../../components/common/FormFields';

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dataTableRef = useRef(null);
    
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    
    // Modal state for line items
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [values, setValues] = useState({
        description: '',
        id_employee: '',
        hours: '',
        rate: '',
        amount: ''
    });

    useEffect(() => {
        let isMounted = true;
        api.get('/api/v1/workforce/employees?limit=1000')
            .then(res => {
                if (isMounted && res.data.data) {
                    setEmployees(res.data.data.map(e => ({ value: e.id, label: `${e.fn} ${e.sn}` })));
                }
            })
            .catch(err => console.error(err));
        return () => { isMounted = false };
    }, []);

    const fetchInvoiceData = async () => {
        setLoading(true);
        try {
            const invRes = await api.get(`/api/v1/finance/invoices/${id}`);
            setInvoice(invRes.data.data);
        } catch (error) {
            console.error('Error fetching invoice details:', error);
            alert('Failed to load invoice details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoiceData();
    }, [id]);

    const lineItemApiService = {
        getAll: (params) => api.get(`/api/v1/finance/invoices/${id}/line-items`, { params }),
        remove: (itemId) => api.patch(`/api/v1/finance/invoices/${id}/line-items/${itemId}/delete`)
    };

    const handleAdd = () => {
        setValues({ description: '', id_employee: '', hours: '', rate: '', amount: '' });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setValues({
            description: item.description || '',
            id_employee: item.id_employee || '',
            hours: item.hours || '',
            rate: item.rate || '',
            amount: item.amount || ''
        });
        setSelectedItemId(item.id);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this line item?')) return;
        try {
            await lineItemApiService.remove(itemId);
            fetchInvoiceData(); // Refresh parent invoice totals
            dataTableRef.current?.refreshData();
        } catch (error) {
            alert('Failed to delete line item');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => {
            const newValues = { ...prev, [name]: value };
            // Auto-calculate amount preview
            if ((name === 'hours' || name === 'rate') && newValues.hours && newValues.rate) {
                newValues.amount = (parseFloat(newValues.hours) * parseFloat(newValues.rate)).toFixed(2);
            }
            return newValues;
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/api/v1/finance/invoices/${id}/line-items/${selectedItemId}`, values);
            } else {
                await api.post(`/api/v1/finance/invoices/${id}/line-items`, values);
            }
            setIsModalOpen(false);
            fetchInvoiceData(); // Refresh parent invoice totals
            dataTableRef.current?.refreshData();
        } catch (error) {
            console.error(error);
            alert('Error saving line item');
        }
    };

    if (loading && !invoice) return <div className="admin-pager"><p>Loading Invoice...</p></div>;
    if (!invoice) return <div className="admin-pager"><p>Invoice not found.</p></div>;

    const columns = [
        { key: 'description', label: 'Description', type: 1, sortable: false, render: (item) => item.description || 'N/A' },
        { key: 'employee', label: 'Employee', type: 1, sortable: false, render: (item) => item.employee_fn ? `${item.employee_fn} ${item.employee_sn}` : '-' },
        { key: 'hours', label: 'Hours', type: 1, sortable: false, render: (item) => item.hours || '-' },
        { key: 'rate', label: 'Rate/Hr', type: 1, sortable: false, render: (item) => item.rate ? `$${parseFloat(item.rate).toFixed(2)}` : '-' },
        { key: 'amount', label: 'Amount', type: 1, sortable: false, render: (item) => (
            <span style={{ fontWeight: '600' }}>${parseFloat(item.amount).toFixed(2)}</span>
        ) }
    ];

    return (
        <div className="admin-pager">
            <div className="admin-pager-head" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <button type="button" className="button" onClick={() => navigate('/admin/finance/invoices')} style={{ padding: '0', border: 'none', background: 'none', color: 'var(--text-muted)' }}>
                    <Icon icon={icons.arrowLeft} /> <span>Back to Invoices</span>
                </button>
                <div className="admin-pager-title">
                    <span>
                        <h2>Invoice {invoice.invoice_number}</h2>
                        <p>Client: {invoice.client_fn} {invoice.client_sn}</p>
                    </span>
                </div>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: '30px', display: 'flex', gap: '40px', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>Invoice Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95em' }}>
                        <div><strong>Period:</strong> {new Date(invoice.period_start).toLocaleDateString()} - {new Date(invoice.period_end).toLocaleDateString()}</div>
                        <div>
                            <strong>Status:</strong> <span className={`td-badge ${invoice.status === 'paid' ? 'success' : invoice.status === 'sent' ? 'info' : 'alt'}`} style={{ marginLeft: '8px' }}>{invoice.status}</span>
                        </div>
                        <div><strong>Due Date:</strong> {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</div>
                    </div>
                </div>
                <div style={{ width: '300px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Summary</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Subtotal:</span>
                        <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                        <span>Tax (7.65%):</span>
                        <span>${parseFloat(invoice.tax).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2em', fontWeight: 'bold', color: 'var(--success-color)' }}>
                        <span>Total:</span>
                        <span>${parseFloat(invoice.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <DataTable 
                        ref={dataTableRef}
                        resourceName="lineItems"
                        apiService={lineItemApiService}
                        columns={columns}
                        config={{ 
                            title: <h3 style={{ margin: 0 }}>Line Items</h3>,
                            add: false,
                            headerActions: [
                                { icon: icons.addSimple, text: 'Add Line Item', onClick: handleAdd }
                            ],
                            edit: false,
                            delete: false,
                            rowActions: [
                                { type: 'button', icon: icons.edit, text: 'Edit', onClick: (item) => handleEdit(item) },
                                { type: 'button', icon: icons.delete, text: 'Delete', className: 'td-btn-danger', onClick: (item) => handleDelete(item.id) }
                            ]
                        }}
                    />
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={isEditMode ? 'Edit Line Item' : 'Add Line Item'}
                actions={[
                    { text: 'Cancel', className: 'btn-secondary', icon: icons.times, onClick: () => setIsModalOpen(false) },
                    { text: isEditMode ? 'Save Changes' : 'Add Line Item', className: 'btn-primary', icon: icons.save, onClick: () => {
                        const form = document.getElementById('lineitem-form');
                        if (form) form.requestSubmit();
                    } }
                ]}
            >
                <form id="lineitem-form" className="form-case" onSubmit={handleSave}>
                    <div className="form-row">
                        <FormInput label="Description" name="description" value={values.description} onChange={handleChange} placeholder="e.g., Development hours" required className="w100" />
                    </div>
                    <div className="form-row">
                        <FormSelect label="Employee (Optional)" name="id_employee" value={values.id_employee} onChange={handleChange} options={employees} className="w100" />
                    </div>
                    <div className="form-row">
                        <FormInput type="number" step="0.01" label="Hours" name="hours" value={values.hours} onChange={handleChange} className="w5" />
                        <FormInput type="number" step="0.01" label="Rate ($)" name="rate" value={values.rate} onChange={handleChange} className="w5" />
                    </div>
                    <div className="form-row">
                        <FormInput type="number" step="0.01" label="Total Amount ($)" name="amount" value={values.amount} onChange={handleChange} required className="w100" />
                    </div>
                    
                    <div className="form-dvr"></div>
                </form>
            </Modal>
        </div>
    );
};

export default InvoiceDetails;
