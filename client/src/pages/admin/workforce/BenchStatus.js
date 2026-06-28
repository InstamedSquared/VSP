import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput, FormTextarea } from '../../../components/common/FormFields';

const p_table = "Bench Status";
const tableService = createResourceService('v1/workforce/bench');

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);
    const [employees, setEmployees] = useState([]);

    const schema = {
        id_employee: { required: true, label: 'Employee' },
        status: { required: true, label: 'Status' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        id_employee: isEditMode ? item.id_employee ?? '' : '',
        status: isEditMode ? item.status ?? 'available' : 'available',
        available_date: isEditMode ? (item.available_date ? moment(item.available_date).format('YYYY-MM-DD') : '') : '',
        notes: isEditMode ? item.notes ?? '' : '',
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
                <FormSelect label="Employee" name="id_employee" value={values.id_employee} error={errors.id_employee} onChange={handleChange} required options={employees} className="w100" />
            </div>
            <div className="form-row">
                <FormSelect label="Status" name="status" value={values.status} error={errors.status} onChange={handleChange} required options={[
                    { value: 'available', label: 'Available' },
                    { value: 'floating', label: 'Floating' },
                    { value: 'partial', label: 'Partial Allocation' },
                    { value: 'cross_trained', label: 'Cross-Trained / Training' },
                    { value: 'backup', label: 'Backup Assigned' }
                ]} className="w5" />
                <FormInput label="Available Date" name="available_date" type="date" value={values.available_date} error={errors.available_date} onChange={handleChange} className="w5" />
            </div>
            <FormTextarea label="Notes" name="notes" placeholder="Additional Notes" rows={3} value={values.notes} onChange={handleChange} autoComplete="off" />
        </form>
    );
};

const BenchStatus = () => {
    const tableColumns = React.useMemo(() => [
        {
            key: 'employee', label: 'Employee', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.fn} ${item.sn}`}</b><p>{item.email}</p></div>
                </div>
            )
        },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const map = {
                available: 'Available',
                floating: 'Floating',
                partial: 'Partial Allocation',
                cross_trained: 'Cross-Trained',
                backup: 'Backup Assigned'
            };
            return map[item.status] || item.status;
        } },
        { key: 'available_date', label: 'Available Date', type: 1, sortable: true, render: (item) => { return item.available_date ? moment(item.available_date).format('MMM. DD, YYYY') : '-'; } },
        { key: 'notes', label: 'Notes', type: 1, sortable: false },
    ], []);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['fn', 'sn', 'status'], 
                title: <span><h2>Workforce Bench</h2><p>Manage Employee Availability and Bench Status</p></span>, 
                modalWidth: 'w-mm',
                useJson: true // Instruct DataTable to send JSON not FormData
            }}
        />
    );
};

export default BenchStatus;
