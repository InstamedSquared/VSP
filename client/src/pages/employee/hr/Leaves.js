import React, { useRef } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import useForm from '../../../hooks/useForm';
import { FormInput, FormSelect } from '../../../components/common/FormFields';

const p_table = "Leave Request";
const tableService = createResourceService('v1/workforce/my-leaves');

const TableForm = ({ item, onSave }) => {
    const isEditMode = Boolean(item);

    const schema = {
        leave_type: { required: true, label: 'Leave Type' },
        start_date: { required: true, label: 'Start Date' },
        end_date: { required: true, label: 'End Date' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        leave_type: isEditMode ? item.leave_type ?? 'vacation' : 'vacation',
        start_date: isEditMode ? (item.start_date ? new Date(item.start_date).toISOString().split('T')[0] : '') : '',
        end_date: isEditMode ? (item.end_date ? new Date(item.end_date).toISOString().split('T')[0] : '') : ''
    }, schema);

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
                <FormSelect label="Leave Type" name="leave_type" value={values.leave_type} error={errors.leave_type} onChange={handleChange} required options={[
                    { value: 'vacation', label: 'Vacation' },
                    { value: 'sick', label: 'Sick Leave' },
                    { value: 'personal', label: 'Personal Leave' },
                    { value: 'emergency', label: 'Emergency Leave' }
                ]} className="w100" />
            </div>
            
            <div className="form-row">
                <FormInput label="Start Date" name="start_date" type="date" value={values.start_date} error={errors.start_date} onChange={handleChange} required className="w5" />
                <FormInput label="End Date" name="end_date" type="date" value={values.end_date} error={errors.end_date} onChange={handleChange} required className="w5" />
            </div>
        </form>
    );
};

const Leaves = () => {
    const dataTableRef = useRef(null);

    const tableColumns = React.useMemo(() => [
        { key: 'leave_type', label: 'Leave Type', type: 1, sortable: true, render: (item) => (
            <span style={{textTransform: 'capitalize'}}><b>{item.leave_type}</b></span>
        ) },
        { key: 'start_date', label: 'Start Date', type: 1, sortable: true, render: (item) => (
            item.start_date ? new Date(item.start_date).toLocaleDateString() : '-'
        ) },
        { key: 'end_date', label: 'End Date', type: 1, sortable: true, render: (item) => (
            item.end_date ? new Date(item.end_date).toLocaleDateString() : '-'
        ) },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const colors = { pending: 'blue', approved: 'green', rejected: 'red', cancelled: 'gray' };
            return <span className={`badge badge-${colors[item.status] || 'gray'}`}>{item.status.toUpperCase()}</span>;
        } },
        { key: 'created_at', label: 'Requested On', type: 1, sortable: true, render: (item) => (
            item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'
        ) }
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: [], 
                title: <span><h2>My Leave Requests</h2><p>Submit and track your time off</p></span>, 
                modalWidth: 'w-md',
                useJson: true,
                add: true,
                edit: true,
                delete: true
            }}
        />
    );
};

export default Leaves;
