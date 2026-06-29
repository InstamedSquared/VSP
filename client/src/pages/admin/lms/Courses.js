import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import useForm from '../../../hooks/useForm';
import { FormInput, FormSelect, FormTextarea } from '../../../components/common/FormFields';

const p_table = "Course";
const tableService = createResourceService('v1/lms/courses');

const TableForm = ({ item, onSave }) => {
    const isEditMode = Boolean(item);

    const schema = {
        title: { required: true, label: 'Course Title' },
        category: { required: true, label: 'Category' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        title: isEditMode ? item.title ?? '' : '',
        description: isEditMode ? item.description ?? '' : '',
        category: isEditMode ? item.category ?? 'internal' : 'internal',
        duration_hours: isEditMode ? item.duration_hours ?? '' : '',
        sort_order: isEditMode ? item.sort_order ?? 0 : 0,
        is_required: isEditMode ? (item.is_required ? true : false) : false,
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
                <FormInput label="Course Title" name="title" value={values.title} error={errors.title} onChange={handleChange} required className="w100" />
            </div>
            
            <FormTextarea label="Description" name="description" value={values.description} error={errors.description} onChange={handleChange} rows={4} className="w100" />
            
            <div className="form-row">
                <FormSelect label="Category" name="category" value={values.category} error={errors.category} onChange={handleChange} required options={[
                    { value: 'internal', label: 'Internal Policies' },
                    { value: 'hipaa', label: 'HIPAA Compliance' },
                    { value: 'dental', label: 'Dental & Medical' },
                    { value: 'insurance', label: 'Insurance Verification' },
                    { value: 'billing', label: 'Medical Billing' },
                    { value: 'customer_service', label: 'Customer Service' }
                ]} className="w5" />
                <FormInput label="Duration (Hours)" name="duration_hours" type="number" value={values.duration_hours} error={errors.duration_hours} onChange={handleChange} className="w5" />
            </div>

            <div className="form-row">
                <div className="input-case w5">
                    <label>Required Course?</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <div className="toggle-switch">
                            <label><input type="checkbox" name="is_required" checked={values.is_required} onChange={handleChange} /><span></span></label>
                        </div>
                        <span style={{ fontSize: '13px', color: '#666' }}>
                            {values.is_required ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
                <FormInput label="Sort Order" name="sort_order" type="number" value={values.sort_order} error={errors.sort_order} onChange={handleChange} className="w5" />
            </div>
        </form>
    );
};

const Courses = () => {
    const dataTableRef = useRef(null);
    const navigate = useNavigate();

    const tableColumns = React.useMemo(() => [
        { key: 'sort_order', label: 'Order', type: 1, sortable: true, render: (item) => <div style={{width:'40px',textAlign:'center'}}><b>{item.sort_order}</b></div> },
        {
            key: 'title', label: 'Course Title', type: 0, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'>
                        <b style={{cursor: 'pointer', color: 'var(--primary)', textDecoration: 'underline'}} onClick={() => navigate(`/admin/lms/courses/${item.id}`)}>{item.title}</b>
                    </div>
                </div>
            )
        },
        { key: 'category', label: 'Category', type: 1, sortable: true, render: (item) => {
            const map = {
                internal: 'Internal Policies', hipaa: 'HIPAA', dental: 'Dental & Medical',
                insurance: 'Insurance', billing: 'Medical Billing', customer_service: 'Customer Service'
            };
            return map[item.category] || item.category;
        } },
        { key: 'duration_hours', label: 'Duration', type: 1, sortable: true, render: (item) => (
            item.duration_hours ? `${item.duration_hours} hrs` : '-'
        ) },
        { key: 'is_required', label: 'Required?', type: 1, sortable: true, render: (item) => (
            item.is_required ? <span className="badge badge-red">Yes</span> : <span className="badge badge-gray">No</span>
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
                searchables: ['title', 'category'], 
                title: <span><h2>Course Catalog</h2><p>Manage LMS courses and training modules</p></span>, 
                modalWidth: 'w-md',
                useJson: true
            }}
        />
    );
};

export default Courses;
