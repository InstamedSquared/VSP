import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput } from '../../../components/common/FormFields';

const p_table = "Skills Inventory";
const tableService = createResourceService('v1/workforce/skills');

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);
    const [employees, setEmployees] = useState([]);

    const schema = {
        id_employee: { required: true, label: 'Employee' },
        skill_name: { required: true, label: 'Skill Name' },
        proficiency_level: { required: true, label: 'Proficiency' },
        years_experience: { required: false, label: 'Years of Experience' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        id_employee: isEditMode ? item.id_employee ?? '' : '',
        skill_name: isEditMode ? item.skill_name ?? '' : '',
        proficiency_level: isEditMode ? item.proficiency_level ?? 'beginner' : 'beginner',
        years_experience: isEditMode ? item.years_experience ?? '' : '',
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
                <FormInput label="Skill Name" name="skill_name" value={values.skill_name} error={errors.skill_name} onChange={handleChange} required placeholder="e.g. React.js, Dental Billing" className="w100" />
            </div>
            <div className="form-row">
                <FormSelect label="Proficiency Level" name="proficiency_level" value={values.proficiency_level} error={errors.proficiency_level} onChange={handleChange} required options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                    { value: 'expert', label: 'Expert' }
                ]} className="w5" />
                <FormInput label="Years of Experience" name="years_experience" type="number" value={values.years_experience} error={errors.years_experience} onChange={handleChange} min="0" className="w5" />
            </div>
        </form>
    );
};

const Skills = () => {
    const tableColumns = React.useMemo(() => [
        {
            key: 'employee', label: 'Employee', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.fn} ${item.sn}`}</b><p>{item.email}</p></div>
                </div>
            )
        },
        { key: 'skill_name', label: 'Skill', type: 1, sortable: true, render: (item) => <b>{item.skill_name}</b> },
        { key: 'proficiency_level', label: 'Proficiency', type: 1, sortable: true, render: (item) => {
            const map = {
                beginner: 'Beginner',
                intermediate: 'Intermediate',
                advanced: 'Advanced',
                expert: 'Expert'
            };
            return map[item.proficiency_level] || item.proficiency_level;
        } },
        { key: 'years_experience', label: 'Experience (Years)', type: 1, sortable: true, render: (item) => { return item.years_experience ? `${item.years_experience} yrs` : '-'; } },
    ], []);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['fn', 'sn', 'skill_name', 'proficiency_level'], 
                title: <span><h2>Skills Inventory</h2><p>Manage Employee Skills and Proficiencies</p></span>, 
                modalWidth: 'w-mm',
                useJson: true
            }}
        />
    );
};

export default Skills;
