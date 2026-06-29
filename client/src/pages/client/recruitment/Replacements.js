import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput, FormTextarea } from '../../../components/common/FormFields';

const tableService = createResourceService('v1/client/my-replacements');

const TableForm = ({ item, onSave }) => {
    const isEditMode = Boolean(item);
    const [employees, setEmployees] = useState([]);

    const schema = {
        id_employee: { required: true, label: 'Employee to Replace' },
        urgency: { required: true, label: 'Urgency' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        id_employee: isEditMode ? item.id_employee ?? '' : '',
        urgency: isEditMode ? item.urgency ?? 'normal' : 'normal',
        reason: isEditMode ? item.reason ?? '' : '',
    }, schema);

    useEffect(() => {
        let isMounted = true;
        // Fetch client's assigned staff for the dropdown
        api.get('/api/v1/client/my-staff?limit=100')
            .then(res => {
                if (isMounted && res.data.success) {
                    const mapped = res.data.data.map(emp => ({
                        value: emp.id,
                        label: `${emp.employee_fn} ${emp.employee_sn}`
                    }));
                    setEmployees(mapped);
                }
            })
            .catch(err => console.error("Error fetching staff", err));
        return () => { isMounted = false; };
    }, []);

    const handleSave = (formValues) => {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            formData.append(key, formValues[key] !== null ? formValues[key] : '');
        });
        onSave(formData, item?.id);
    };

    return (
        <form className="form-case" noValidate onSubmit={handleSubmit(handleSave)}>
            <div className="form-row">
                <FormSelect label="Employee to Replace" name="id_employee" value={values.id_employee} error={errors.id_employee} onChange={handleChange} required options={employees} className="w100" disabled={isEditMode && item.status !== 'pending'} />
            </div>
            <div className="form-row">
                <FormSelect label="Urgency" name="urgency" value={values.urgency} error={errors.urgency} onChange={handleChange} required options={[
                    { value: 'low', label: 'Low' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High' },
                    { value: 'emergency', label: 'Emergency' }
                ]} className="w100" disabled={isEditMode && item.status !== 'pending'} />
            </div>
            <FormTextarea label="Reason for Replacement" name="reason" placeholder="Please provide details..." rows={4} value={values.reason} onChange={handleChange} disabled={isEditMode && item.status !== 'pending'} />
        </form>
    );
};

const ReplacementRequests = () => {
    const tableColumns = React.useMemo(() => [
        { key: 'employee', label: 'Employee Being Replaced', type: 1, sortable: true, render: (item) => `${item.employee_fn} ${item.employee_sn}` },
        { key: 'urgency', label: 'Urgency', type: 1, sortable: true, render: (item) => <span style={{ textTransform: 'capitalize' }}>{item.urgency}</span> },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const map = {
                pending: <span style={{color: 'orange'}}>Pending</span>,
                in_progress: <span style={{color: 'blue'}}>In Progress</span>,
                resolved: <span style={{color: 'green'}}>Resolved</span>,
                cancelled: <span style={{color: 'red'}}>Cancelled</span>
            };
            return map[item.status] || item.status;
        } },
        { key: 'replacement', label: 'Replacement Staff', type: 1, sortable: false, render: (item) => item.id_replacement ? `${item.replacement_fn} ${item.replacement_sn}` : '-' },
        { key: 'created_at', label: 'Date Requested', type: 1, sortable: true, render: (item) => moment(item.created_at).format('MMM. DD, YYYY') },
    ], []);

    return (
        <DataTable
            resourceName="Replacement Requests"
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: [], 
                title: <span><h2>Replacement Requests</h2><p>Request new staff replacements</p></span>, 
                modalWidth: 'w-mm',
                useJson: true,
                delete: false
            }}
        />
    );
};

export default ReplacementRequests;
