import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DataTable from '../../components/common/DataTable';
import { createResourceService } from '../../services/api.service';
import useForm from '../../hooks/useForm';
import { FormInput, FormSelect, FormTextarea } from '../../components/common/FormFields';
import { icons } from '../../config/icons';

const p_avatar = "defaults/avatar.png";
const p_table = "User";

const TableForm = ({ item, onSave, apiService }) => {
    const isEditMode = Boolean(item);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const schema = {
        fn: { required: true, label: 'First Name' },
        sn: { required: true, label: 'Last Name' },
        email: { required: true, type: 'email', label: 'Email Address', validateOnChange: true },
        gender: { required: true, label: 'Gender' },
        bday: { required: true, label: 'Birthday' }
    };

    const { values, errors, handleChange, handleSubmit, registerRef } = useForm({
        fn: isEditMode ? item.fn ?? '' : '',
        mn: isEditMode ? item.mn ?? '' : '',
        sn: isEditMode ? item.sn ?? '' : '',
        bday: isEditMode ? (item.bday ? moment(item.bday).format('YYYY-MM-DD') : '') : '',
        gender: isEditMode ? item.gender ?? '' : '',
        phone: isEditMode ? item.phone ?? '' : '',
        email: isEditMode ? item.email ?? '' : '',
        address: isEditMode ? item.address ?? '' : '',
    }, schema);

    useEffect(() => {
        let isMounted = true;
        if (isEditMode && item.photoUrl) {
            if (apiService && typeof apiService.getPhoto === 'function') {
                const photoUrlWithCacheBust = `${item.photoUrl}?t=${Date.now()}`;
                apiService.getPhoto(photoUrlWithCacheBust)
                    .then(response => {
                        if (isMounted) { const localUrl = URL.createObjectURL(response.data); setPhotoPreview(localUrl); }
                    }).catch(() => { if (isMounted) setPhotoPreview(`/${p_avatar}`); });
            } else { if (isMounted) setPhotoPreview(`/${p_avatar}`); }
        }
        return () => { isMounted = false; };
    }, [isEditMode, item, apiService]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = (formValues) => {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            formData.append(key, formValues[key]);
        });
        if (photoFile) {
            formData.append('photo', photoFile);
        }
        onSave(formData, item?.id);
    };

    return (
        <form className="form-case" noValidate id={`${p_table}_form`} onSubmit={handleSubmit(handleSave)}>
            <div className="form-profile form-row">
                <div className="form-profile-photo">
                    <img src={photoPreview || `/${p_avatar}`} alt="Profile Preview" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = `/${p_avatar}`; }} />
                    <label htmlFor="photo-upload">Select Photo</label>
                </div>
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} />
                <div className="form-profile-info">
                    <div className="form-row-fx">
                        <FormInput label="First Name" name="fn" placeholder="First Name" error={errors.fn} value={values.fn} onChange={handleChange} required className="w5-fx" />
                        <FormInput label="Middle Name" name="mn" placeholder="Middle Name" value={values.mn} onChange={handleChange} className="w5-fx" />
                    </div>
                    <FormInput label="Last Name" name="sn" placeholder="Last Name" value={values.sn} error={errors.sn} onChange={handleChange} required />
                </div>
            </div>
            <div className="form-dvr"></div>
            <div className="form-row">
                <FormSelect label="Gender" name="gender" value={values.gender} error={errors.gender} onChange={handleChange} required options={[{ value: '1', label: 'Male' }, { value: '2', label: 'Female' }]} className="w5" />
                <FormInput label="Birthday" name="bday" type="date" value={values.bday} error={errors.bday} onChange={handleChange} required className="w5" />
            </div>
            <div className="form-row">
                <FormInput label="Phone" name="phone" placeholder="Phone Number" value={values.phone} onChange={handleChange} autoComplete="off" className="w5" />
                <FormInput label="Email Address" name="email" type="email" placeholder="Email" value={values.email} error={errors.email} onChange={handleChange} required autoComplete="off" className="w5" />
            </div>
            <FormTextarea label="Address" name="address" placeholder="Address" rows={2} value={values.address} onChange={handleChange} autoComplete="off" />
        </form>
    );
};

const tableService = createResourceService('users');

const Table = () => {
    const initialLoadTime = React.useMemo(() => Date.now(), []);
    const [photoOverrides, setPhotoOverrides] = useState({});

    const handleSaveSuccess = React.useCallback((itemId, formData) => {
        if (itemId && formData.has('photo')) {
            setPhotoOverrides(prev => ({ ...prev, [itemId]: Date.now() }));
        }
    }, []);

    const tableColumns = React.useMemo(() => [
        {
            key: 'fn', label: 'Full Name', type: 0, sortable: true, render: (item, photoUrl) => {
                let displayUrl = photoUrl || `/${p_avatar}`;
                if (displayUrl.includes('?')) displayUrl = displayUrl.split('?')[0];

                const timestampToUse = photoOverrides[item.id] || initialLoadTime;
                displayUrl = `${displayUrl}?t=${timestampToUse}`;

                return (
                    <div className='td-user'>
                        <div className='td-user-photo'><img src={displayUrl} alt={`${item.fn} ${item.sn}`} loading='lazy' onError={(e) => { e.target.onerror = null; e.target.src = `/${p_avatar}`; }} /></div>
                        <div className='tr-name'><b>{`${item.fn} ${item.mn ? item.mn : ''} ${item.sn}`}</b><p>{item.email}</p> </div>
                    </div>
                );
            }
        },
        { key: 'gender', label: 'Gender', type: 1, sortable: true, render: (item) => (item.gender === '1' ? 'Male' : (item.gender === '2') ? 'Female' : '') },
        { key: 'bday', label: 'Birthday', type: 1, sortable: true, render: (item) => { return item.bday ? moment(item.bday).format('MMM. DD, YYYY') : ''; } },
        { key: 'phone', label: 'Phone', type: 1, sortable: true },
        { key: 'address', label: 'Address', type: 1, sortable: true },
    ], [initialLoadTime, photoOverrides]);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ searchables: ['fn|mn|sn', 'fn|sn', 'sn|fn|mn', 'phone', 'email'], title: <span><h2>Admin User Account</h2><p>Manage Users, Roles, and Permissions</p></span>, modalWidth: 'w-mm', tableControlsx: false, onSaveSuccess: handleSaveSuccess }}
        />);
};

export default Table;