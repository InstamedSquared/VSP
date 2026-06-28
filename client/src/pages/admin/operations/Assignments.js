import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import useForm from '../../../hooks/useForm';
import { useAuth } from '../../../context/AuthContext';
import { FormSelect, FormInput } from '../../../components/common/FormFields';

const p_table = "Staff Assignment";
const tableService = createResourceService('v1/operations/assignments');

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);
    const { user } = useAuth();
    const isAdmin = user?.kind === 'admin';

    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);

    const schema = {
        id_client: { required: true, label: 'Client' },
        id_employee: { required: true, label: 'Employee' },
        status: { required: true, label: 'Status' },
        billing_type: { required: true, label: 'Billing Type' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        id_client: isEditMode ? item.id_client ?? '' : '',
        id_employee: isEditMode ? item.id_employee ?? '' : '',
        status: isEditMode ? item.status ?? 'active' : 'active',
        billing_type: isEditMode ? item.billing_type ?? 'hourly' : 'hourly',
        hourly_rate: isEditMode ? item.hourly_rate ?? '' : '',
        monthly_rate: isEditMode ? item.monthly_rate ?? '' : '',
        start_date: isEditMode ? (item.start_date ? moment(item.start_date).format('YYYY-MM-DD') : '') : '',
        end_date: isEditMode ? (item.end_date ? moment(item.end_date).format('YYYY-MM-DD') : '') : '',
    }, schema);

    useEffect(() => {
        let isMounted = true;
        api.get('/api/clients?limit=1000')
            .then(res => {
                if (isMounted && res.data.data) {
                    setClients(res.data.data.map(c => ({ value: c.id, label: `${c.fn} ${c.sn}` })));
                }
            })
            .catch(console.error);
            
        api.get('/api/v1/workforce/employees')
            .then(res => {
                if (isMounted && res.data.data) {
                    setEmployees(res.data.data.map(e => ({ value: e.id, label: `${e.fn} ${e.sn}` })));
                }
            })
            .catch(console.error);

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
                <FormSelect label="Client" name="id_client" value={values.id_client} error={errors.id_client} onChange={handleChange} required options={clients} className="w5" />
                <FormSelect label="Employee" name="id_employee" value={values.id_employee} error={errors.id_employee} onChange={handleChange} required options={employees} className="w5" />
            </div>
            <div className="form-row">
                <FormInput label="Start Date" name="start_date" type="date" value={values.start_date} error={errors.start_date} onChange={handleChange} className="w5" />
                <FormInput label="End Date" name="end_date" type="date" value={values.end_date} error={errors.end_date} onChange={handleChange} className="w5" />
            </div>
            
            <div className="form-dvr"></div>
            
            <div className="form-row">
                <FormSelect label="Status" name="status" value={values.status} error={errors.status} onChange={handleChange} required options={[
                    { value: 'active', label: 'Active' },
                    { value: 'ended', label: 'Ended' },
                    { value: 'on_hold', label: 'On Hold' }
                ]} className="w5" />
                <FormSelect label="Billing Type" name="billing_type" value={values.billing_type} error={errors.billing_type} onChange={handleChange} required options={[
                    { value: 'hourly', label: 'Hourly Rate' },
                    { value: 'monthly', label: 'Monthly Retainer' }
                ]} className="w5" />
            </div>

            <div className="form-row">
                <FormInput label="Hourly Rate ($)" name="hourly_rate" type="number" step="0.01" value={values.hourly_rate} error={errors.hourly_rate} onChange={handleChange} className="w5" disabled={!isAdmin} />
                <FormInput label="Monthly Rate ($)" name="monthly_rate" type="number" step="0.01" value={values.monthly_rate} error={errors.monthly_rate} onChange={handleChange} className="w5" disabled={!isAdmin} />
            </div>
            {!isAdmin && <p className="gray-text" style={{ fontSize: '0.85rem', marginTop: '-10px', marginBottom: '15px' }}>* Billing rates can only be edited by Admin or Finance personnel.</p>}
        </form>
    );
};

const Assignments = () => {
    const tableColumns = React.useMemo(() => [
        {
            key: 'client', label: 'Client', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.client_fn} ${item.client_sn}`}</b></div>
                </div>
            )
        },
        {
            key: 'employee', label: 'Employee', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.employee_fn} ${item.employee_sn}`}</b><p>{item.employee_email}</p></div>
                </div>
            )
        },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const map = { active: 'Active', ended: 'Ended', on_hold: 'On Hold' };
            return <b>{map[item.status] || item.status}</b>;
        } },
        { key: 'billing_type', label: 'Billing Type', type: 1, sortable: true, render: (item) => (item.billing_type === 'hourly' ? 'Hourly' : 'Monthly') },
        { key: 'rates', label: 'Rates', type: 1, sortable: true, render: (item) => {
            if (item.billing_type === 'hourly') return item.hourly_rate ? `$${item.hourly_rate}/hr` : '-';
            return item.monthly_rate ? `$${item.monthly_rate}/mo` : '-';
        } },
        { key: 'dates', label: 'Duration', type: 1, sortable: false, render: (item) => {
            const start = item.start_date ? moment(item.start_date).format('MMM DD, YYYY') : '?';
            const end = item.end_date ? moment(item.end_date).format('MMM DD, YYYY') : 'Present';
            return <div>{start} - {end}</div>;
        } },
    ], []);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['client_fn', 'client_sn', 'employee_fn', 'employee_sn'], 
                title: <span><h2>Staff Assignments</h2><p>Manage employee deployments to clients</p></span>, 
                modalWidth: 'w-mm',
                useJson: true
            }}
        />
    );
};

export default Assignments;
