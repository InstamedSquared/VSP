import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput, FormTextarea } from '../../../components/common/FormFields';

const p_table = "Pipeline";
const tableService = createResourceService('v1/recruitment/pipeline');

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);
    const [applicants, setApplicants] = useState([]);

    const schema = {
        id_applicant: { required: true, label: 'Applicant' },
        stage: { required: true, label: 'Stage' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        id_applicant: isEditMode ? item.id_applicant ?? '' : '',
        stage: isEditMode ? item.stage ?? 'screening' : 'screening',
        interviewer: isEditMode ? item.interviewer ?? '' : '',
        scheduled_at: isEditMode ? (item.scheduled_at ? moment(item.scheduled_at).format('YYYY-MM-DDTHH:mm') : '') : '',
        completed_at: isEditMode ? (item.completed_at ? moment(item.completed_at).format('YYYY-MM-DDTHH:mm') : '') : '',
        notes: isEditMode ? item.notes ?? '' : '',
    }, schema);

    useEffect(() => {
        let isMounted = true;
        api.get('/api/v1/recruitment/applicants?limit=1000')
            .then(res => {
                if (isMounted && res.data.data) {
                    const mapped = res.data.data.map(app => ({
                        value: app.id,
                        label: `${app.fn} ${app.sn} (${app.email})`
                    }));
                    setApplicants(mapped);
                }
            })
            .catch(err => console.error("Error fetching applicants", err));
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
                <FormSelect label="Applicant" name="id_applicant" value={values.id_applicant} error={errors.id_applicant} onChange={handleChange} required options={applicants} className="w100" />
            </div>
            <div className="form-row">
                <FormSelect label="Stage" name="stage" value={values.stage} error={errors.stage} onChange={handleChange} required options={[
                    { value: 'applied', label: 'Applied' },
                    { value: 'screening', label: 'Screening' },
                    { value: 'assessment', label: 'Assessment' },
                    { value: 'interview', label: 'Interview' },
                    { value: 'client_interview', label: 'Client Interview' },
                    { value: 'hired', label: 'Hired' },
                    { value: 'pool', label: 'Talent Pool' },
                    { value: 'reprofile', label: 'Reprofile' }
                ]} className="w5" />
                <FormInput label="Interviewer" name="interviewer" value={values.interviewer} error={errors.interviewer} onChange={handleChange} placeholder="Interviewer Name" className="w5" />
            </div>
            <div className="form-row">
                <FormInput label="Scheduled At" name="scheduled_at" type="datetime-local" value={values.scheduled_at} error={errors.scheduled_at} onChange={handleChange} className="w5" />
                <FormInput label="Completed At" name="completed_at" type="datetime-local" value={values.completed_at} error={errors.completed_at} onChange={handleChange} className="w5" />
            </div>
            <FormTextarea label="Notes" name="notes" placeholder="Interview feedback or notes..." rows={3} value={values.notes} onChange={handleChange} autoComplete="off" />
        </form>
    );
};

const Pipeline = () => {
    const tableColumns = React.useMemo(() => [
        {
            key: 'applicant', label: 'Applicant', type: 1, sortable: true, render: (item) => {
                const photoUrl = item.photoUrl || `/defaults/avatar.png`;
                return (
                    <div className='td-user'>
                        <div className='td-user-photo'><img src={photoUrl} alt="avatar" loading='lazy' onError={(e) => { e.target.onerror = null; e.target.src = `/defaults/avatar.png`; }} /></div>
                        <div className='tr-name'><b>{`${item.applicant_fn} ${item.applicant_sn}`}</b></div>
                    </div>
                );
            }
        },
        { key: 'stage', label: 'Stage', type: 1, sortable: true, render: (item) => {
            const map = {
                applied: 'Applied', screening: 'Screening', assessment: 'Assessment',
                interview: 'Interview', client_interview: 'Client Interview',
                hired: 'Hired', pool: 'Talent Pool', reprofile: 'Reprofile'
            };
            return <b>{map[item.stage] || item.stage}</b>;
        } },
        { key: 'interviewer', label: 'Interviewer', type: 1, sortable: true },
        { key: 'scheduled_at', label: 'Schedule', type: 1, sortable: true, render: (item) => { 
            return item.scheduled_at ? moment(item.scheduled_at).format('MMM. DD, YYYY h:mm A') : '-'; 
        } },
        { key: 'completed_at', label: 'Completed', type: 1, sortable: true, render: (item) => { 
            return item.completed_at ? moment(item.completed_at).format('MMM. DD, YYYY h:mm A') : '-'; 
        } },
    ], []);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['applicant_fn', 'applicant_sn', 'stage', 'interviewer'], 
                title: <span><h2>Pipeline Tracking</h2><p>Track applicant progression through recruitment stages</p></span>, 
                modalWidth: 'w-mm',
                useJson: true
            }}
        />
    );
};

export default Pipeline;
