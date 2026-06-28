import React from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput } from '../../../components/common/FormFields';

const p_table = "Applicant";
const tableService = createResourceService('v1/recruitment/applicants');

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);
    const [photoPreview, setPhotoPreview] = React.useState(null);
    const [photoFile, setPhotoFile] = React.useState(null);

    React.useEffect(() => {
        if (isEditMode && item.photoUrl) {
            setPhotoPreview(`${item.photoUrl}?t=${Date.now()}`);
        }
    }, [isEditMode, item]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const schema = {
        fn: { required: true, label: 'First Name' },
        mn: { required: false, label: 'Middle Name' },
        sn: { required: true, label: 'Last Name' },
        email: { required: true, label: 'Email' },
        phone: { required: true, label: 'Phone Number' },
        gender: { required: true, label: 'Gender' },
        bday: { required: true, label: 'Birthday' },
        source: { required: true, label: 'Source' },
        status: { required: true, label: 'Status' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        fn: isEditMode ? item.fn ?? '' : '',
        mn: isEditMode ? item.mn ?? '' : '',
        sn: isEditMode ? item.sn ?? '' : '',
        email: isEditMode ? item.email ?? '' : '',
        phone: isEditMode ? item.phone ?? '' : '',
        gender: isEditMode ? item.gender ?? '' : '',
        bday: isEditMode ? (item.bday ? item.bday.split('T')[0] : '') : '',
        source: isEditMode ? item.source ?? '' : '',
        status: isEditMode ? item.status ?? 'applied' : 'applied',
    }, schema);

    const handleSave = (formValues) => {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            formData.append(key, formValues[key] !== null ? formValues[key] : '');
        });
        if (photoFile) {
            formData.append('photo', photoFile);
        }
        onSave(formData, item?.id);
    };

    return (
        <form className="form-case" noValidate onSubmit={handleSubmit(handleSave)}>
            <div className="form-profile form-row">
                <div className="form-profile-photo">
                    <img src={photoPreview || `/defaults/avatar.png`} alt="Profile Preview" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = `/defaults/avatar.png`; }} />
                    <label htmlFor="photo-upload">Select Photo</label>
                </div>
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                <div className="form-profile-info">
                    <div className="form-row-fx">
                        <FormInput label="First Name" name="fn" value={values.fn} error={errors.fn} onChange={handleChange} required className="w5-fx" />
                        <FormInput label="Middle Name" name="mn" value={values.mn} error={errors.mn} onChange={handleChange} className="w5-fx" />
                    </div>
                    <FormInput label="Last Name" name="sn" value={values.sn} error={errors.sn} onChange={handleChange} required />
                </div>
            </div>
            
            <div className="form-dvr"></div>

            <div className="form-row">
                <FormSelect label="Gender" name="gender" value={values.gender} error={errors.gender} onChange={handleChange} required options={[{ value: '1', label: 'Male' }, { value: '2', label: 'Female' }]} className="w5" />
                <FormInput label="Birthday" name="bday" type="date" value={values.bday} error={errors.bday} onChange={handleChange} required className="w5" />
            </div>
            <div className="form-row">
                <FormInput label="Email Address" name="email" type="email" value={values.email} error={errors.email} onChange={handleChange} required className="w5" />
                <FormInput label="Phone Number" name="phone" value={values.phone} error={errors.phone} onChange={handleChange} required className="w5" />
            </div>
            <div className="form-row">
                <FormSelect label="Source" name="source" value={values.source} error={errors.source} onChange={handleChange} required options={[
                    { value: 'website', label: 'Website' },
                    { value: 'referral', label: 'Referral' },
                    { value: 'job_board', label: 'Job Board' },
                    { value: 'social_media', label: 'Social Media' }
                ]} className="w5" />
                <FormSelect label="Status" name="status" value={values.status} error={errors.status} onChange={handleChange} required options={[
                    { value: 'applied', label: 'Applied' },
                    { value: 'screening', label: 'Screening' },
                    { value: 'assessment', label: 'Assessment' },
                    { value: 'interview', label: 'Interview' },
                    { value: 'client_interview', label: 'Client Interview' },
                    { value: 'hired', label: 'Hired' },
                    { value: 'pool', label: 'Talent Pool' },
                    { value: 'reprofile', label: 'Reprofile' },
                    { value: 'rejected', label: 'Rejected' }
                ]} className="w5" />
            </div>
        </form>
    );
};

const Applicants = () => {
    const [photoOverrides, setPhotoOverrides] = React.useState({});
    const initialLoadTime = React.useMemo(() => Date.now(), []);

    const handleSaveSuccess = React.useCallback((itemId, formData) => {
        if (itemId && formData && formData.has('photo')) {
            setPhotoOverrides(prev => ({ ...prev, [itemId]: Date.now() }));
        }
    }, []);

    const tableColumns = React.useMemo(() => [
        {
            key: 'name', label: 'Name', type: 1, sortable: true, render: (item) => {
                let displayUrl = item.photoUrl || `/defaults/avatar.png`;
                if (displayUrl.includes('?')) displayUrl = displayUrl.split('?')[0];
                const timestampToUse = photoOverrides[item.id] || initialLoadTime;
                displayUrl = `${displayUrl}?t=${timestampToUse}`;

                return (
                    <div className='td-user'>
                        <div className='td-user-photo'><img src={displayUrl} alt="avatar" loading='lazy' onError={(e) => { e.target.onerror = null; e.target.src = `/defaults/avatar.png`; }} /></div>
                        <div className='tr-name'><b>{`${item.fn} ${item.sn}`}</b></div>
                    </div>
                );
            }
        },
        { key: 'email', label: 'Contact', type: 1, sortable: true, render: (item) => (
            <div>
                <div>{item.email}</div>
                <div className="gray-text">{item.phone}</div>
            </div>
        ) },
        { key: 'gender', label: 'Gender', type: 1, sortable: true, render: (item) => (item.gender === '1' ? 'Male' : (item.gender === '2') ? 'Female' : '') },
        { key: 'bday', label: 'Birthday', type: 1, sortable: true, render: (item) => { return item.bday ? moment(item.bday).format('MMM. DD, YYYY') : ''; } },
        { key: 'source', label: 'Source', type: 1, sortable: true, render: (item) => {
            const map = { website: 'Website', referral: 'Referral', job_board: 'Job Board', social_media: 'Social Media' };
            return map[item.source] || item.source;
        } },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const map = {
                applied: 'Applied', screening: 'Screening', assessment: 'Assessment',
                interview: 'Interview', client_interview: 'Client Interview',
                hired: 'Hired', pool: 'Talent Pool', reprofile: 'Reprofile', rejected: 'Rejected'
            };
            return <b>{map[item.status] || item.status}</b>;
        } }
    ], []);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['fn', 'sn', 'email', 'phone', 'source', 'status'], 
                title: <span><h2>Applicants Pipeline</h2><p>Manage incoming recruitment candidates</p></span>, 
                modalWidth: 'w-mm',
                useJson: true,
                onSaveSuccess: handleSaveSuccess
            }}
        />
    );
};

export default Applicants;
