import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/api';
import DataTable from '../../../components/common/DataTable';
import { icons } from '../../../config/icons';
import Icon from '../../../components/common/Icon';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect } from '../../../components/common/FormFields';
import { createResourceService } from '../../../services/api.service';

const payrollApiService = createResourceService('v1/finance/payrolls');

const formatLocalDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Payroll = () => {
    const dataTableRef = useRef(null);
    const [employees, setEmployees] = useState([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [values, setValues] = useState({
        id_employee: '',
        period_start: '',
        period_end: '',
        gross_pay: '',
        deductions: '',
        net_pay: '',
        status: 'draft',
        payment_date: ''
    });

    useEffect(() => {
        let isMounted = true;
        api.get('/api/employees?limit=1000')
            .then(res => {
                if (isMounted && res.data.data) {
                    setEmployees(res.data.data.map(e => ({ value: e.id, label: `${e.fn} ${e.sn}` })));
                }
            })
            .catch(err => console.error('Error fetching employees:', err));
        return () => { isMounted = false };
    }, []);

    // Calculate Net Pay dynamically
    useEffect(() => {
        const gross = parseFloat(values.gross_pay) || 0;
        const ded = parseFloat(values.deductions) || 0;
        setValues(prev => ({ ...prev, net_pay: (gross - ded).toFixed(2) }));
    }, [values.gross_pay, values.deductions]);

    const handleAdd = () => {
        setValues({ id_employee: '', period_start: '', period_end: '', gross_pay: '', deductions: '', net_pay: '', status: 'draft', payment_date: '' });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setValues({
            id_employee: item.id_employee || '',
            period_start: formatLocalDate(item.period_start),
            period_end: formatLocalDate(item.period_end),
            gross_pay: item.gross_pay || '',
            deductions: item.deductions || '',
            net_pay: item.net_pay || '',
            status: item.status || 'draft',
            payment_date: formatLocalDate(item.payment_date)
        });
        setSelectedId(item.id);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this payroll record?')) return;
        try {
            await payrollApiService.remove(id);
            dataTableRef.current?.refreshData();
        } catch (error) {
            alert('Failed to delete payroll record');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        // Prepare FormData because generic API expects it (due to upload.none() or upload.single() depending on config)
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });

        try {
            if (isEditMode) {
                await payrollApiService.update(selectedId, formData);
            } else {
                await payrollApiService.create(formData);
            }
            setIsModalOpen(false);
            dataTableRef.current?.refreshData();
        } catch (error) {
            console.error(error);
            alert('Error saving payroll record');
        }
    };

    const handleExport = async () => {
        try {
            const searchInput = document.getElementById('datatable-search');
            const searchTerm = searchInput ? searchInput.value : '';
            
            // Get current active filters from the URL or DataTable internally? 
            // The DataTable doesn't expose activeFilters directly, but we can fetch them via a hack if needed,
            // Or we just export all data for now or fetch whatever is possible.
            // Since we need to adopt the date filter, let's fetch based on that. 
            // Wait, we can intercept the DataTable's fetch or just let DataTable export if it had it.
            // But we will manually query the backend for all records up to a high limit.
            const response = await payrollApiService.getAll({ limit: 10000, search: searchTerm });
            const data = response.data.data;
            
            if (!data || data.length === 0) {
                alert("No records to export.");
                return;
            }

            const headers = ['ID', 'Employee', 'Period Start', 'Period End', 'Gross Pay', 'Deductions', 'Net Pay', 'Status', 'Payment Date'];
            const rows = data.map(item => [
                item.id,
                `${item.employee_fn || ''} ${item.employee_sn || ''}`.trim(),
                item.period_start ? new Date(item.period_start).toLocaleDateString() : '',
                item.period_end ? new Date(item.period_end).toLocaleDateString() : '',
                item.gross_pay || '0.00',
                item.deductions || '0.00',
                item.net_pay || '0.00',
                item.status || '',
                item.payment_date ? new Date(item.payment_date).toLocaleDateString() : ''
            ]);
            
            const csvContent = "data:text/csv;charset=utf-8," 
                + headers.join(",") + "\n"
                + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
                
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `payrolls_export_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch(err) {
            console.error("Export failed", err);
            alert("Failed to export data.");
        }
    };

    const columns = [
        { key: 'employee_fn', label: 'Employee', type: 1, sortable: true, render: (item) => `${item.employee_fn} ${item.employee_sn}` },
        {
            key: 'period_start', label: 'Pay Period', type: 1, sortable: true, render: (item) => (
                <div style={{ fontSize: '0.85em' }}>
                    <div>{new Date(item.period_start).toLocaleDateString()} to</div>
                    <div>{new Date(item.period_end).toLocaleDateString()}</div>
                </div>
            )
        },
        { key: 'gross_pay', label: 'Gross Pay', type: 1, sortable: true, render: (item) => `$${parseFloat(item.gross_pay).toFixed(2)}` },
        { key: 'deductions', label: 'Deductions', type: 1, sortable: true, render: (item) => `$${parseFloat(item.deductions).toFixed(2)}` },
        {
            key: 'net_pay', label: 'Net Pay', type: 1, sortable: true, render: (item) => (
                <span style={{ fontWeight: '600', color: 'var(--success-color)' }}>${parseFloat(item.net_pay).toFixed(2)}</span>
            )
        },
        {
            key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
                const badgeClass = item.status === 'paid' ? 'success' : item.status === 'processing' ? 'info' : 'alt';
                return <span className={`td-badge ${badgeClass}`}>{item.status}</span>;
            }
        },
        { key: 'payment_date', label: 'Payment Date', type: 1, sortable: true, render: (item) => item.payment_date ? new Date(item.payment_date).toLocaleDateString() : '-' }
    ];

    return (
        <>
            <DataTable
                ref={dataTableRef}
                resourceName="payrolls"
                apiService={payrollApiService}
                columns={columns}
                filters={[{ key: 'period_start', type: 'daterange', label: 'Period' }]}
                config={{ 
                    title: <span><h2>Payroll</h2><p>Manage employee payrolls and compensation</p></span>,
                    add: false,
                    headerActions: [
                        { icon: icons.csv, text: 'Export CSV', onClick: handleExport },
                        { icon: icons.addSimple, text: 'Add New', onClick: handleAdd }
                    ],
                    edit: false,
                    delete: false,
                    rowActions: [
                        { type: 'button', icon: icons.edit, text: 'Edit', className: 'td-btn-edit', onClick: (item) => handleEdit(item) },
                        { type: 'button', icon: icons.delete, text: 'Delete', className: 'td-btn-delete', onClick: (item) => handleDelete(item.id) }
                    ]
                }}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? 'Edit Payroll Record' : 'Create Payroll Record'}
                actions={[
                    { text: 'Cancel', className: 'btn-secondary', icon: icons.times, onClick: () => setIsModalOpen(false) },
                    {
                        text: isEditMode ? 'Save Changes' : 'Create Record', className: 'btn-primary', icon: icons.save, onClick: () => {
                            const form = document.getElementById('payroll-form');
                            if (form) form.requestSubmit();
                        }
                    }
                ]}
            >
                <form id="payroll-form" className="form-case" onSubmit={handleSave}>
                    <div className="form-row">
                        <FormSelect label="Employee" name="id_employee" value={values.id_employee} onChange={handleChange} required options={employees} className="w100" />
                    </div>
                    <div className="form-row">
                        <FormInput type="date" label="Period Start" name="period_start" value={values.period_start} onChange={handleChange} required className="w5" />
                        <FormInput type="date" label="Period End" name="period_end" value={values.period_end} onChange={handleChange} required className="w5" />
                    </div>
                    <div className="form-row">
                        <FormInput type="number" step="0.01" label="Gross Pay ($)" name="gross_pay" value={values.gross_pay} onChange={handleChange} required className="w33" />
                        <FormInput type="number" step="0.01" label="Deductions ($)" name="deductions" value={values.deductions} onChange={handleChange} required className="w33" />
                        <FormInput type="number" step="0.01" label="Net Pay ($)" name="net_pay" value={values.net_pay} onChange={handleChange} required className="w33" readOnly />
                    </div>
                    <div className="form-row">
                        <FormSelect label="Status" name="status" value={values.status} onChange={handleChange} required options={[
                            { value: 'draft', label: 'Draft' },
                            { value: 'processing', label: 'Processing' },
                            { value: 'paid', label: 'Paid' }
                        ]} className="w5" />
                        <FormInput type="date" label="Payment Date" name="payment_date" value={values.payment_date} onChange={handleChange} className="w5" />
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Payroll;
