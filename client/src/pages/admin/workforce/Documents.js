import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput } from '../../../components/common/FormFields';

const p_table = "Employee Documents";
const tableService = createResourceService('v1/workforce/documents');

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);
    const [employees, setEmployees] = useState([]);
    const [file, setFile] = useState(null);

    const schema = {
        id_employee: { required: true, label: 'Employee' },
        document_type: { required: true, label: 'Document Type' },
        title: { required: true, label: 'Document Title' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        id_employee: isEditMode ? item.id_employee ?? '' : '',
        document_type: isEditMode ? item.document_type ?? 'resume' : 'resume',
        title: isEditMode ? item.title ?? '' : '',
    }, schema);

    useEffect(() => {
        let isMounted = true;
        api.get('/api/v1/workforce/employees')
            .then(res => {
                if (isMounted && res.data.success) {
                    const mapped = res.data.data.map(emp => ({
                        value: emp.id,
                        label: `${emp.fn} ${emp.sn} (${emp.email})`
                    }));
                    setEmployees(mapped);
                }
            })
            .catch(err => console.error("Error fetching employees", err));
        return () => { isMounted = false; };
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSave = (formValues) => {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            formData.append(key, formValues[key] !== null ? formValues[key] : '');
        });
        
        if (file) {
            formData.append('file', file);
        } else if (!isEditMode) {
            // New upload requires file
            alert('Please select a file to upload');
            return;
        }

        onSave(formData, item?.id);
    };

    return (
        <form className="form-case" noValidate onSubmit={handleSubmit(handleSave)}>
            <div className="form-row">
                <FormSelect label="Employee" name="id_employee" value={values.id_employee} error={errors.id_employee} onChange={handleChange} required options={employees} className="w100" />
            </div>
            <div className="form-row">
                <FormSelect label="Document Type" name="document_type" value={values.document_type} error={errors.document_type} onChange={handleChange} required options={[
                    { value: 'resume', label: 'Resume' },
                    { value: 'government_id', label: 'Government ID' },
                    { value: 'certification', label: 'Certification / License' },
                    { value: 'contract', label: 'Contract' },
                    { value: 'emergency_contact', label: 'Emergency Contact Form' },
                    { value: 'other', label: 'Other' }
                ]} className="w100" />
            </div>
            <div className="form-row">
                <FormInput label="Document Title" name="title" value={values.title} error={errors.title} onChange={handleChange} required placeholder="e.g. 2026 Resume" className="w100" />
            </div>
            <div className="form-row">
                <div className="input-case w100">
                    <label>Upload File {isEditMode ? '(Leave blank to keep existing)' : '*'}</label>
                    <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" style={{ marginTop: '5px' }} />
                </div>
            </div>
        </form>
    );
};

const Documents = () => {
    const handleDownload = (item) => {
        if (item.file_path) {
            window.open(`/uploads/${item.file_path}`, '_blank');
        } else {
            alert('No file available for download.');
        }
    };

    const tableColumns = React.useMemo(() => [
        {
            key: 'employee', label: 'Employee', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.fn} ${item.sn}`}</b><p>{item.email}</p></div>
                </div>
            )
        },
        { key: 'title', label: 'Document Title', type: 1, sortable: true, render: (item) => <b>{item.title}</b> },
        { key: 'document_type', label: 'Type', type: 1, sortable: true, render: (item) => {
            const map = {
                resume: 'RESUME',
                government_id: 'GOVERNMENT ID',
                certification: 'CERTIFICATION',
                contract: 'CONTRACT',
                emergency_contact: 'EMERGENCY CONTACT',
                other: 'OTHER'
            };
            return <span style={{ fontSize: '12px', color: '#666', letterSpacing: '0.5px' }}>{map[item.document_type] || item.document_type.toUpperCase()}</span>;
        } },
        { key: 'created_at', label: 'Date Uploaded', type: 1, sortable: true, render: (item) => {
            return new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } },
    ], []);

    const rowActions = [
        {
            text: 'Download',
            onClick: handleDownload,
            className: 'td-btn-secondary'
        }
    ];

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['fn', 'sn', 'title', 'document_type'], 
                title: <span><h2>HR Documents</h2><p>View and manage employee documents</p></span>, 
                modalWidth: 'w-mm',
                useJson: false,
                rowActions: rowActions
            }}
        />
    );
};

export default Documents;
