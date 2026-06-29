import React, { useState } from 'react';
import useForm from '../../../hooks/useForm';
import DataTable from '../../../components/common/DataTable';
import { FormInput, FormSelect, FormTextarea } from '../../../components/common/FormFields';
import { icons } from '../../../config/icons';
import { useModal } from '../../../context/ModalContext';
import { useNotifier } from '../../../context/NotificationContext';
import api from '../../../api/api';
import { createResourceService } from '../../../services/api.service';

const p_table = 'client_requests';
const tableService = createResourceService('v1/operations/client-requests');

const TableForm = ({ item, onSave }) => {
    const isEditMode = Boolean(item);
    
    const { values, handleChange, handleSubmit } = useForm({
        company_name: isEditMode ? item.company_name ?? '' : '',
        contact_person: isEditMode ? item.contact_person ?? '' : '',
        email: isEditMode ? item.email ?? '' : '',
        phone: isEditMode ? item.phone ?? '' : '',
        role_requested: isEditMode ? item.role_requested ?? '' : '',
        status: isEditMode ? item.status ?? 'pending' : 'pending',
        requirements_notes: isEditMode ? item.requirements_notes ?? '' : '',
    });

    const onSubmit = (formData) => {
        onSave(formData, item?.id);
    };

    return (
        <form className="form-case" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-profile-info">
                <h3>Request Details</h3>
            </div>
            
            <div className="form-row">
                <FormInput label="Company Name" name="company_name" value={values.company_name} onChange={handleChange} required className="w5" />
                <FormInput label="Contact Person" name="contact_person" value={values.contact_person} onChange={handleChange} required className="w5" />
            </div>

            <div className="form-row">
                <FormInput label="Email" type="email" name="email" value={values.email} onChange={handleChange} required className="w5" />
                <FormInput label="Phone" name="phone" value={values.phone} onChange={handleChange} className="w5" />
            </div>
            
            <div className="form-row">
                <FormInput label="Role Requested" name="role_requested" value={values.role_requested} onChange={handleChange} required className="w5" />
                <FormSelect label="Status" name="status" options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' }
                ]} value={values.status} onChange={handleChange} required className="w5" />
            </div>

            <div className="form-row" style={{ display: 'block' }}>
                <FormTextarea label="Requirements & Notes" name="requirements_notes" value={values.requirements_notes} onChange={handleChange} />
            </div>
        </form>
    );
};

const ClientRequests = () => {
    const { openPopup, closePopup } = useModal();
    const { notify } = useNotifier();
    
    // Force re-render of datatable
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleApprove = (item) => {
        const proceed = async () => {
            try {
                await api.post(`/api/v1/operations/client-requests/${item.id}/approve`);
                notify({ message: 'Client request approved and account created successfully!', style: 'success' });
                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                notify({ message: error.response?.data?.message || 'Error approving request', style: 'error' });
            } finally {
                closePopup();
            }
        };

        openPopup({
            title: `Confirm Approval`,
            widthClass: 'w-md',
            content: <p>Are you sure you want to approve the request for <strong>{item.company_name}</strong>? <br />This will generate a client portal account for <strong>{item.contact_person}</strong> and send them a welcome email.</p>,
            actions: [
                { text: 'Cancel', icon: icons.times, className: 'btn-secondary', onClick: closePopup },
                { text: 'Yes, Approve', icon: icons.check, className: 'btn-primary', onClick: proceed }
            ]
        });
    };

    const tableColumns = React.useMemo(() => [
        { key: 'company_name', label: 'Company', type: 1, sortable: true },
        { key: 'contact_person', label: 'Contact Person', type: 1, sortable: true, render: (item) => (
            <div>
                <div><b>{item.contact_person}</b></div>
                <div style={{ fontSize: '0.85em', color: '#64748b' }}>{item.email}</div>
                <div style={{ fontSize: '0.85em', color: '#64748b' }}>{item.phone}</div>
            </div>
        ) },
        { key: 'role_requested', label: 'Role Requested', type: 1, sortable: true },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const colors = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };
            const statusColor = colors[item.status] || '#64748b';
            return (
                <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    backgroundColor: `${statusColor}20`,
                    color: statusColor,
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    {item.status}
                </span>
            );
        } },
        { key: 'created_at', label: 'Requested Date', type: 3, sortable: true }
    ], []);

    return (
        <DataTable
            key={refreshTrigger}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['company_name', 'contact_person', 'email', 'role_requested', 'status'], 
                title: <span><h2>Client Requests</h2><p>Manage incoming staffing inquiries</p></span>, 
                modalWidth: 'w-mm',
                useJson: true,
                rowActions: [
                    {
                        text: 'Approve Request',
                        icon: icons.check,
                        onClick: handleApprove,
                        disabled: (item) => item.status === 'approved'
                    }
                ]
            }}
        />
    );
};

export default ClientRequests;
