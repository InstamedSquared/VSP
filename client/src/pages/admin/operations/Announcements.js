import React, { useRef } from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import useForm from '../../../hooks/useForm';
import { FormInput, FormSelect, FormTextarea } from '../../../components/common/FormFields';

const p_table = "Announcement";
const tableService = createResourceService('v1/operations/announcements');

const TableForm = ({ item, onSave }) => {
    const isEditMode = Boolean(item);

    const schema = {
        title: { required: true, label: 'Title' },
        target_audience: { required: true, label: 'Target Audience' },
        priority: { required: true, label: 'Priority' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        title: isEditMode ? item.title ?? '' : '',
        content: isEditMode ? item.content ?? '' : '',
        target_audience: isEditMode ? item.target_audience ?? 'all' : 'all',
        priority: isEditMode ? item.priority ?? 'normal' : 'normal',
        published_at: isEditMode ? (item.published_at ? moment(item.published_at).format('YYYY-MM-DDTHH:mm') : '') : '',
        expires_at: isEditMode ? (item.expires_at ? moment(item.expires_at).format('YYYY-MM-DDTHH:mm') : '') : '',
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
                <FormInput label="Title" name="title" value={values.title} error={errors.title} onChange={handleChange} required className="w100" />
            </div>
            <FormTextarea label="Content" name="content" value={values.content} error={errors.content} onChange={handleChange} rows={5} className="w100" />
            
            <div className="form-row">
                <FormSelect label="Target Audience" name="target_audience" value={values.target_audience} error={errors.target_audience} onChange={handleChange} required options={[
                    { value: 'all', label: 'All Users' },
                    { value: 'admin', label: 'Administrators Only' },
                    { value: 'employees', label: 'All Employees' },
                    { value: 'clients', label: 'Clients Only' }
                ]} className="w5" />
                <FormSelect label="Priority" name="priority" value={values.priority} error={errors.priority} onChange={handleChange} required options={[
                    { value: 'low', label: 'Low' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' }
                ]} className="w5" />
            </div>
            
            <div className="form-row">
                <FormInput label="Publish At" name="published_at" type="datetime-local" value={values.published_at} error={errors.published_at} onChange={handleChange} className="w5" />
                <FormInput label="Expires At" name="expires_at" type="datetime-local" value={values.expires_at} error={errors.expires_at} onChange={handleChange} className="w5" />
            </div>
        </form>
    );
};

const Announcements = () => {
    const dataTableRef = useRef(null);

    const tableColumns = React.useMemo(() => [
        {
            key: 'title', label: 'Title', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{item.title}</b></div>
                </div>
            )
        },
        { key: 'target_audience', label: 'Audience', type: 1, sortable: true, render: (item) => {
            const map = {
                all: 'All Users', admin: 'Admins', employees: 'Employees', 
                clients: 'Clients'
            };
            return map[item.target_audience] || item.target_audience;
        } },
        { key: 'priority', label: 'Priority', type: 1, sortable: true, render: (item) => {
            let badgeClass = 'badge-gray';
            if (item.priority === 'urgent') badgeClass = 'badge-red';
            else if (item.priority === 'high') badgeClass = 'badge-yellow';
            else if (item.priority === 'normal') badgeClass = 'badge-blue';
            
            const map = { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' };
            return <span className={`badge ${badgeClass}`}>{map[item.priority] || item.priority}</span>;
        } },
        { key: 'published_at', label: 'Published', type: 1, sortable: true, render: (item) => (
            item.published_at ? moment(item.published_at).format('MMM DD, YYYY h:mm A') : '-'
        ) },
        { key: 'expires_at', label: 'Expires', type: 1, sortable: true, render: (item) => (
            item.expires_at ? moment(item.expires_at).format('MMM DD, YYYY h:mm A') : '-'
        ) },
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['title'], 
                title: <span><h2>Announcements</h2><p>Manage Company-wide and Targeted Announcements</p></span>, 
                modalWidth: 'w-mm',
                useJson: true
            }}
        />
    );
};

export default Announcements;
