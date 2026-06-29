import React, { useMemo } from 'react';
import DataTable from '../../../components/common/DataTable';
import { FormInput, FormSelect } from '../../../components/common/FormFields';
import FormEditor from '../../../components/common/RichTextEditor';
import useForm from '../../../hooks/useForm';
import moment from 'moment';
import { createResourceService } from '../../../services/api.service';

const tableService = createResourceService('v1/recruitment/jobs');
const p_table = "Job Postings";

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);

    const { values, errors, handleChange, handleSubmit, setValues } = useForm({
        title: isEditMode ? item.title ?? '' : '',
        department: isEditMode ? item.department ?? '' : '',
        location: isEditMode ? item.location ?? '' : '',
        employment_type: isEditMode ? item.employment_type ?? 'full_time' : 'full_time',
        status: isEditMode ? item.status ?? 'draft' : 'draft',
        description: isEditMode ? item.description ?? '' : '',
        requirements: isEditMode ? item.requirements ?? '' : '',
        salary_range: isEditMode ? item.salary_range ?? '' : ''
    }, { title: { required: true } });

    const handleEditorChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

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
                <FormInput label="Job Title" name="title" value={values.title} error={errors.title} onChange={handleChange} required className="w7" />
                <FormSelect 
                    label="Status" 
                    name="status" 
                    value={values.status} 
                    onChange={handleChange} 
                    className="w3"
                    options={[
                        { label: 'Draft', value: 'draft' },
                        { label: 'Published', value: 'published' },
                        { label: 'Closed', value: 'closed' }
                    ]}
                />
            </div>
            
            <div className="form-row">
                <FormInput label="Department" name="department" value={values.department} onChange={handleChange} className="w4" />
                <FormInput label="Location" name="location" value={values.location} onChange={handleChange} className="w4" />
                <FormSelect 
                    label="Employment Type" 
                    name="employment_type" 
                    value={values.employment_type} 
                    onChange={handleChange} 
                    className="w4"
                    options={[
                        { label: 'Full Time', value: 'full_time' },
                        { label: 'Part Time', value: 'part_time' },
                        { label: 'Contract', value: 'contract' },
                        { label: 'Freelance', value: 'freelance' }
                    ]}
                />
            </div>

            <div className="form-row">
                <FormInput label="Salary Range" name="salary_range" value={values.salary_range} onChange={handleChange} placeholder="e.g. $50,000 - $70,000" />
            </div>

            <div className="form-row" style={{ display: 'block' }}>
                <div className="input-case">
                    <p>Job Description</p>
                    <FormEditor value={values.description} onChange={(val) => handleEditorChange('description', val)} />
                </div>
            </div>

            <div className="form-row" style={{ display: 'block', marginTop: '20px' }}>
                <div className="input-case">
                    <p>Requirements</p>
                    <FormEditor value={values.requirements} onChange={(val) => handleEditorChange('requirements', val)} />
                </div>
            </div>
        </form>
    );
};

const JobPostings = () => {
    const tableColumns = useMemo(() => [
        { key: 'title', label: 'Job Title', type: 1, sortable: true },
        { key: 'department', label: 'Department', type: 1, sortable: true },
        { key: 'location', label: 'Location', type: 1, sortable: true },
        { 
            key: 'employment_type', 
            label: 'Type',
            type: 1, sortable: true,
            render: (item) => item.employment_type ? item.employment_type.replace('_', ' ').toUpperCase() : '-'
        },
        { 
            key: 'status', 
            label: 'Status',
            type: 1, sortable: true,
            render: (item) => (
                <span className={`badge ${item.status === 'published' ? 'badge-success' : item.status === 'draft' ? 'badge-warning' : 'badge-danger'}`}>
                    {item.status.toUpperCase()}
                </span>
            )
        },
        { 
            key: 'created_at', 
            label: 'Created',
            type: 1, sortable: true,
            render: (item) => moment(item.created_at).format('MMM D, YYYY')
        }
    ], []);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{
                widthClass: 'w-lg',
                defaultSortBy: 'created_at',
                defaultSortOrder: 'desc',
                title: 'Job Postings',
                subtitle: 'Manage internal and external career opportunities'
            }}
            hideViewToggle={true}
        />
    );
};

export default JobPostings;
