import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput } from '../../../components/common/FormFields';
import { icons } from '../../../config/icons';
import Icon from '../../../components/common/Icon';

const p_table = "Compliance Record";
const tableService = createResourceService('v1/operations/compliance');

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);

    const [employees, setEmployees] = useState([]);
    const [file, setFile] = useState(null);

    const schema = {
        id_employee: { required: true, label: 'Employee' },
        compliance_type: { required: true, label: 'Compliance Type' },
        status: { required: true, label: 'Status' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        id_employee: isEditMode ? item.id_employee ?? '' : '',
        compliance_type: isEditMode ? item.compliance_type ?? 'nda' : 'nda',
        status: isEditMode ? item.status ?? 'pending' : 'pending',
        due_date: isEditMode ? (item.due_date ? moment(item.due_date).format('YYYY-MM-DD') : '') : '',
        completed_at: isEditMode ? (item.completed_at ? moment(item.completed_at).format('YYYY-MM-DDTHH:mm') : '') : '',
    }, schema);

    useEffect(() => {
        let isMounted = true;
        api.get('/api/v1/workforce/employees?limit=1000')
            .then(res => {
                if (isMounted && res.data.data) {
                    setEmployees(res.data.data.map(e => ({ value: e.id, label: `${e.fn} ${e.sn}` })));
                }
            })
            .catch(console.error);
        return () => { isMounted = false; };
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSave = (formValues) => {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            formData.append(key, formValues[key] !== null ? formValues[key] : '');
        });
        if (file) {
            formData.append('document', file);
        }
        onSave(formData, item?.id);
    };

    return (
        <form className="form-case" noValidate onSubmit={handleSubmit(handleSave)}>
            <div className="form-row">
                <FormSelect label="Employee" name="id_employee" value={values.id_employee} error={errors.id_employee} onChange={handleChange} required options={employees} className="w100" />
            </div>
            <div className="form-row">
                <FormSelect label="Compliance Type" name="compliance_type" value={values.compliance_type} error={errors.compliance_type} onChange={handleChange} required options={[
                    { value: 'nda', label: 'NDA (Non-Disclosure Agreement)' },
                    { value: 'hipaa', label: 'HIPAA Certification' },
                    { value: 'device_check', label: 'Device & Hardware Check' },
                    { value: 'internet_redundancy', label: 'Internet Redundancy' },
                    { value: 'training', label: 'Required Training' },
                    { value: 'policy_ack', label: 'Policy Acknowledgment' }
                ]} className="w5" />
                <FormSelect label="Status" name="status" value={values.status} error={errors.status} onChange={handleChange} required options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'compliant', label: 'Compliant' },
                    { value: 'non_compliant', label: 'Non-Compliant' },
                    { value: 'expired', label: 'Expired' }
                ]} className="w5" />
            </div>
            <div className="form-row">
                <FormInput label="Due Date" name="due_date" type="date" value={values.due_date} error={errors.due_date} onChange={handleChange} className="w5" />
                <FormInput label="Completed At" name="completed_at" type="datetime-local" value={values.completed_at} error={errors.completed_at} onChange={handleChange} className="w5" />
            </div>

            <div className="form-dvr"></div>
            
            <div className="form-row">
                <div className="input-case w100">
                    <p>Document Upload <span className="gray-text">(PDF, Images, Word)</span></p>
                    <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" />
                    {isEditMode && item.document_path && !file && (
                        <div style={{ marginTop: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icon icon={icons.file} /> Current File: <span className="td-badge info" style={{ padding: '4px 10px' }}>{item.document_path}</span>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

const Compliance = () => {
    const tableColumns = React.useMemo(() => [
        {
            key: 'employee', label: 'Employee', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.employee_fn} ${item.employee_sn}`}</b></div>
                </div>
            )
        },
        { key: 'compliance_type', label: 'Type', type: 1, sortable: true, render: (item) => {
            const map = {
                nda: 'NDA', hipaa: 'HIPAA', device_check: 'Device Check', 
                internet_redundancy: 'Internet Redundancy', training: 'Training', policy_ack: 'Policy Acknowledgment'
            };
            return <b>{map[item.compliance_type] || item.compliance_type}</b>;
        } },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            let badgeClass = 'badge-gray';
            if (item.status === 'compliant') badgeClass = 'badge-green';
            else if (item.status === 'non_compliant' || item.status === 'expired') badgeClass = 'badge-red';
            else if (item.status === 'pending') badgeClass = 'badge-yellow';
            
            const map = { pending: 'Pending', compliant: 'Compliant', non_compliant: 'Non-Compliant', expired: 'Expired' };
            return <span className={`badge ${badgeClass}`}>{map[item.status] || item.status}</span>;
        } },
        { key: 'due_date', label: 'Due Date', type: 1, sortable: true, render: (item) => (
            item.due_date ? moment(item.due_date).format('MMM DD, YYYY') : '-'
        ) },
        { key: 'completed_at', label: 'Completed', type: 1, sortable: false, render: (item) => (
            item.completed_at ? moment(item.completed_at).format('MMM DD, YYYY') : '-'
        ) },
        { key: 'document', label: 'Document', type: 1, sortable: false, render: (item) => (
            item.document_path ? (
                <a href={`/api/v1/operations/compliance/${item.id}/download`} target="_blank" rel="noreferrer" className="td-badge info" style={{ textDecoration: 'none' }}>
                    <Icon icon={icons.download} /> View
                </a>
            ) : <span className="gray-text">None</span>
        ) },
    ], []);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['employee_fn', 'employee_sn', 'compliance_type'], 
                title: <span><h2>Compliance Records</h2><p>Manage Employee Certifications, Checks, and Policies</p></span>, 
                modalWidth: 'w-mm',
                useJson: true
            }}
        />
    );
};

export default Compliance;
