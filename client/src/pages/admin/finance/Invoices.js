import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import DataTable from '../../../components/common/DataTable';
import { icons } from '../../../config/icons';
import Icon from '../../../components/common/Icon';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect } from '../../../components/common/FormFields';

const Invoices = () => {
    const navigate = useNavigate();
    const dataTableRef = useRef(null);
    const [clients, setClients] = useState([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [values, setValues] = useState({
        id_client: '',
        period_start: '',
        period_end: '',
        status: 'draft',
        due_date: ''
    });

    useEffect(() => {
        let isMounted = true;
        api.get('/api/clients?limit=1000')
            .then(res => {
                if (isMounted && res.data.data) {
                    setClients(res.data.data.map(c => ({ value: c.id, label: `${c.fn} ${c.sn}` })));
                }
            })
            .catch(err => console.error('Error fetching clients:', err));
        return () => { isMounted = false };
    }, []);

    const invoiceApiService = {
        getAll: (params) => api.get('/api/v1/finance/invoices', { params }),
        remove: (id) => api.patch(`/api/v1/finance/invoices/${id}/delete`)
    };

    const handleAdd = () => {
        setValues({ id_client: '', period_start: '', period_end: '', status: 'draft', due_date: '' });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setValues({
            id_client: item.id_client || '',
            period_start: item.period_start ? item.period_start.split('T')[0] : '',
            period_end: item.period_end ? item.period_end.split('T')[0] : '',
            status: item.status || 'draft',
            due_date: item.due_date ? item.due_date.split('T')[0] : ''
        });
        setSelectedId(item.id);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;
        try {
            await invoiceApiService.remove(id);
            dataTableRef.current?.refreshData();
        } catch (error) {
            alert('Failed to delete invoice');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/api/v1/finance/invoices/${selectedId}`, values);
            } else {
                await api.post('/api/v1/finance/invoices', values);
            }
            setIsModalOpen(false);
            dataTableRef.current?.refreshData();
        } catch (error) {
            console.error(error);
            alert('Error saving invoice');
        }
    };

    const columns = [
        {
            key: 'invoice_number', label: 'Invoice #', type: 1, sortable: true, render: (item) => (
                <span style={{ fontWeight: '600' }}>{item.invoice_number}</span>
            )
        },
        { key: 'client_fn', label: 'Client', type: 1, sortable: true, render: (item) => `${item.client_fn} ${item.client_sn}` },
        {
            key: 'period_start', label: 'Billing Period', type: 1, sortable: true, render: (item) => (
                <div style={{ fontSize: '0.85em' }}>
                    <div>{new Date(item.period_start).toLocaleDateString()} to</div>
                    <div>{new Date(item.period_end).toLocaleDateString()}</div>
                </div>
            )
        },
        {
            key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
                const badgeClass = item.status === 'paid' ? 'success' : item.status === 'sent' ? 'info' : item.status === 'overdue' ? 'danger' : 'alt';
                return <span className={`td-badge ${badgeClass}`}>{item.status}</span>;
            }
        },
        { key: 'due_date', label: 'Due Date', type: 1, sortable: true, render: (item) => item.due_date ? new Date(item.due_date).toLocaleDateString() : '-' },
        {
            key: 'total', label: 'Total Amount', type: 1, sortable: true, render: (item) => (
                <span style={{ fontWeight: '600', color: 'var(--success-color)' }}>${parseFloat(item.total).toFixed(2)}</span>
            )
        }
    ];

    return (
        <>
            <DataTable
                ref={dataTableRef}
                resourceName="invoices"
                apiService={invoiceApiService}
                columns={columns}
                config={{ 
                    title: <span><h2>Invoices</h2><p>Manage client billing and invoices</p></span>,
                    add: false,
                    headerActions: [
                        { icon: icons.addSimple, text: 'Add New', onClick: handleAdd }
                    ],
                    edit: false,
                    delete: false,
                    rowActions: [
                        { type: 'button', icon: icons.eye, text: 'View Details', className: '', onClick: (item) => navigate(`/admin/finance/invoices/${item.id}`) },
                        { type: 'button', icon: icons.edit, text: 'Edit', className: 'td-btn-edit', onClick: (item) => handleEdit(item) },
                        { type: 'button', icon: icons.delete, text: 'Delete', className: 'td-btn-delete', onClick: (item) => handleDelete(item.id) }
                    ]
                }}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? 'Edit Invoice' : 'Create Invoice'}
                actions={[
                    { text: 'Cancel', className: 'btn-secondary', icon: icons.times, onClick: () => setIsModalOpen(false) },
                    {
                        text: isEditMode ? 'Save Changes' : 'Create Invoice', className: 'btn-primary', icon: icons.save, onClick: () => {
                            const form = document.getElementById('invoice-form');
                            if (form) form.requestSubmit();
                        }
                    }
                ]}
            >
                <form id="invoice-form" className="form-case" onSubmit={handleSave}>
                    <div className="form-row">
                        <FormSelect label="Client" name="id_client" value={values.id_client} onChange={handleChange} required options={clients} className="w100" />
                    </div>
                    <div className="form-row">
                        <FormInput type="date" label="Period Start" name="period_start" value={values.period_start} onChange={handleChange} required className="w5" />
                        <FormInput type="date" label="Period End" name="period_end" value={values.period_end} onChange={handleChange} required className="w5" />
                    </div>
                    <div className="form-row">
                        <FormSelect label="Status" name="status" value={values.status} onChange={handleChange} required options={[
                            { value: 'draft', label: 'Draft' },
                            { value: 'sent', label: 'Sent' },
                            { value: 'paid', label: 'Paid' },
                            { value: 'overdue', label: 'Overdue' },
                            { value: 'void', label: 'Void' }
                        ]} className="w5" />
                        <FormInput type="date" label="Due Date" name="due_date" value={values.due_date} onChange={handleChange} className="w5" />
                    </div>


                </form>
            </Modal>
        </>
    );
};

export default Invoices;
