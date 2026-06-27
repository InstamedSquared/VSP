import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { useNotifier } from '../../context/NotificationContext';
import { createResourceService } from '../../services/api.service';
import moment from 'moment';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import useForm from '../../hooks/useForm';
import { FormInput, FormSelect, FormTextarea, FormPassword } from '../../components/common/FormFields';


const ProfileForm = ({ item, onSave }) => {
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const schema = useMemo(() => ({
        fn: { required: true, label: 'First Name' },
        sn: { required: true, label: 'Last Name' },
        email: { required: true, type: 'email', label: 'Email Address' },
        gender: { required: true, label: 'Gender' }
    }), []);

    const initialValues = useMemo(() => ({
        fn: item?.fn ?? '',
        mn: item?.mn ?? '',
        sn: item?.sn ?? '',
        phone: item?.phone ?? '',
        email: item?.email ?? '',
        address: item?.address ?? '',
        gender: item?.gender ?? '',
        bday: item?.bday ? moment(item.bday).format('YYYY-MM-DD') : '',
    }), [item]);

    const { values, errors, handleChange, handleSubmit } = useForm(initialValues, schema);

    useEffect(() => {
        if (item?.photoUrl) {
            setPhotoPreview(`${item.photoUrl}?t=${Date.now()}`);
        } else {
            setPhotoPreview('/defaults/avatar.png');
        }
    }, [item]);

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
        onSave(formData);
    };

    return (<form className='form-case' noValidate id='Profile_form' onSubmit={handleSubmit(handleSave)} autoComplete='On' >
        <div className='form-row form-profile'>
            <div className='form-profile-photo'><img src={photoPreview || '/defaults/avatar.png'} alt='Profile Preview' loading='lazy' onError={(e) => { e.target.onerror = null; e.target.src = '/defaults/avatar.png'; }} /><label htmlFor='photo-upload'>Select Photo</label></div>
            <input id='photo-upload' type='file' accept='image/*' onChange={handlePhotoChange} />
            <div className='form-profile-info'>
                <div className='form-row'>
                    <FormInput label="First Name" name="fn" placeholder="First Name" value={values.fn} error={errors.fn} onChange={handleChange} required className="w5-fx" />
                    <FormInput label="Middle Name" name="mn" placeholder="Middle Name" value={values.mn} onChange={handleChange} className="w5-fx" />
                </div>
                <FormInput label="Last Name" name="sn" placeholder="Last Name" value={values.sn} error={errors.sn} onChange={handleChange} required />
            </div>
        </div>
        <div className='form-dvr'></div>
        <div className='form-row'>
            <div className='w5'>
                <div className='form-row-fx'>
                    <FormSelect label="Gender" name="gender" value={values.gender} error={errors.gender} onChange={handleChange} required className="w4-fx" options={[{ value: '1', label: 'Male' }, { value: '2', label: 'Female' }]} />
                    <FormInput label="Birthday" name="bday" type="date" value={values.bday} error={errors.bday} onChange={handleChange} className="w6-fx" />
                </div>
            </div>
            <div className='w5'> <FormInput label="Position" name="position" value={item.position} readOnly /></div>
        </div>
        <div className='form-row'>
            <FormInput label="Phone" name="phone" placeholder="Phone Number" value={values.phone} error={errors.phone} onChange={handleChange} className="w5" autoComplete="on" />
            <FormInput label="Email Address" name="email" type="email" placeholder="Email" value={values.email} error={errors.email} onChange={handleChange} required className="w5" autoComplete="on" />
        </div>
        <FormTextarea label="Address" name="address" placeholder="Address" rows={2} value={values.address} error={errors.address} onChange={handleChange} autoComplete="on" />
    </form>);
};

const ChangePassword = ({ user, onSave }) => {
    const schema = useMemo(() => ({
        username: { required: true, label: 'Username' },
        oldPassword: { required: true, label: 'Password' },
        newPassword: { type: 'password', complex: true, label: 'New Password', minLength: 9 },
        confirmPassword: { match: 'newPassword', matchError: 'Passwords do not match', label: 'Confirm Password' }
    }), []);

    const initialValues = useMemo(() => ({
        username: user?.un || user?.username || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    }), [user]);

    const { values, errors, handleChange, handleSubmit, setErrors } = useForm(initialValues, schema);

    const handleSave = async (formValues) => {
        const success = await onSave({
            username: formValues.username,
            oldPassword: formValues.oldPassword,
            newPassword: formValues.newPassword.trim()
        });

        if (success === false) {
            setErrors(prev => ({ ...prev, oldPassword: 'Invalid Password' }));
        } else if (success && typeof success === 'string') {
            if (success.toLowerCase().includes('username')) {
                setErrors(prev => ({ ...prev, username: success }));
            } else {
                setErrors(prev => ({ ...prev, oldPassword: success }));
            }
        }
    };

    return (<form id='ChangePassword_form' noValidate className='form-case' onSubmit={handleSubmit(handleSave)} autoComplete='Off'>
        <div className='form-row'>
            <FormInput label="Username" name="username" value={values.username} error={errors.username} onChange={handleChange} required iconLeft={icons.user} className="w5" />
            <FormPassword label="Old Password" name="oldPassword" value={values.oldPassword} error={errors.oldPassword} onChange={handleChange} required noHints className="w5" />
        </div>
        <div className='form-dvr'></div>
        <div className='form-row'>
            <FormPassword label="New Password" name="newPassword" placeholder="New Password (Optional)" value={values.newPassword} error={errors.newPassword} onChange={handleChange} className="w5" minChars={9} />
            <FormPassword label="Confirm Password" name="confirmPassword" value={values.confirmPassword} error={errors.confirmPassword} onChange={handleChange} noHints className="w5" />
        </div>
    </form>);
};

const Profile = () => {

    const { openPopup, closePopup } = useModal();
    const showAlert = ({ isAlert = true, style = '', title = '', content = '', closeOnBackdropClick = true, duration = 0 } = {}) => { openPopup({ isAlert, style: style, title: title, content: content, duration: duration, closeOnBackdropClick: closeOnBackdropClick }); };

    const { user, updateUserInContext } = useAuth();
    const { notify } = useNotifier();

    const TOGGLE_CONFIG = {
        otp: {
            title: 'Two-Factor Authentication',
            label: 'Two-Factor',
            messages: {
                enable: 'Enabling Two-Factor Authentication adds a significant layer of security to your account. You will be required to provide a verification code each time you log in. Are you sure you want to proceed?',
                disable: 'Disabling Two-Factor Authentication will lower the security of your account, making it more vulnerable to unauthorized access. Are you sure you want to turn this off?'
            }
        },
        event: {
            title: 'Event Notifications',
            label: 'Events',
            messages: {
                enable: 'Enabling Event Notifications means you will receive updates about important events and activities. Do you want to proceed?',
                disable: 'Disabling Event Notifications means you will miss out on important event updates. Are you sure you want to turn this off?'
            }
        },
        notification: {
            title: 'System Notifications',
            label: 'Notifications',
            messages: {
                enable: 'Enabling System Notifications ensures you stay updated with important system alerts. Do you want to proceed?',
                disable: 'Disabling System Notifications might cause you to miss critical system alerts. Are you sure you want to turn this off?'
            }
        }
    };

    const [toggles, setToggles] = useState({
        otp: user.otp === 1,
        event: user.event === 1,
        notification: user.notification === 1
    });

    const getService = () => {
        const resourceMap = { 'admin': 'users', 'employee': 'employees', 'client': 'clients' };
        return createResourceService(resourceMap[user.kind] || 'users');
    };

    const updateToggle = async (key, newValue) => {
        try {
            const formData = new FormData();
            formData.append(key, newValue ? 1 : 0);

            const dynamicService = getService();
            const response = await dynamicService.update(user.id, formData);

            if (response.data.success) {
                setToggles(prev => ({ ...prev, [key]: newValue }));
                updateUserInContext({ ...user, [key]: newValue ? 1 : 0 });
                const action = newValue ? 'Enabled' : 'Disabled';
                notify({ title: TOGGLE_CONFIG[key].label, message: `${action} Successfully`, style: newValue ? 'success' : 'warning' });
                closePopup();
            } else {
                notify({ message: response.data.message || 'Failed to update settings', style: 'error' });
            }
        } catch (error) {
            console.error(error);
            notify({ message: 'An error occurred while updating settings', style: 'error' });
        }
    };

    const handleToggle = (key) => (e) => {
        const newValue = e.target.checked;
        const config = TOGGLE_CONFIG[key];
        const title = `${newValue ? 'Enable' : 'Disable'} ${config.title}?`;
        const content = newValue ? config.messages.enable : config.messages.disable;

        openPopup({
            title: title,
            content: <div className='popup-msg'><p>{content}</p></div>,
            actions: [
                { text: 'Cancel', className: 'btn-secondary', icon: icons.close, onClick: closePopup },
                { text: 'Confirm', className: 'btn-primary', icon: icons.save, onClick: () => updateToggle(key, newValue) }
            ]
        });
    };

    const handleSave = async (formData) => {
        try {
            const dynamicService = getService();
            const response = await dynamicService.update(user.id, formData);

            if (response.data.success) {
                const updatedUser = response.data.data || response.data.user;

                if (updatedUser) {
                    if (formData.has('photo')) {
                        updatedUser.photoUrl = `${updatedUser.photoUrl}?t=${Date.now()}`;
                    } else {
                        const currentUrl = user.photoUrl || '';
                        const cleanCurrent = currentUrl.split('?')[0];
                        const newUrl = updatedUser.photoUrl || '';

                        if (cleanCurrent === newUrl && currentUrl.includes('?t=')) {
                            updatedUser.photoUrl = currentUrl;
                        }
                    }
                    updateUserInContext(updatedUser);
                } else {
                    const updates = {};
                    formData.forEach((value, key) => {
                        if (key !== 'photo') updates[key] = value;
                    });
                    if (formData.has('photo')) {
                        if (response.data.data) {
                            response.data.data.photoUrl = `${response.data.data.photoUrl}?t=${Date.now()}`;
                            updateUserInContext(response.data.data);
                        }
                    } else {
                        if (response.data.data) {
                            const data = response.data.data;
                            const currentUrl = user.photoUrl || '';
                            const cleanCurrent = currentUrl.split('?')[0];
                            const newUrl = data.photoUrl || '';
                            if (cleanCurrent === newUrl && currentUrl.includes('?t=')) {
                                data.photoUrl = currentUrl;
                            }
                            updateUserInContext(data);
                        }
                    }
                }

                notify({ message: 'Successfully Updated', style: 'success' });
                closePopup();
            } else {
                notify({ message: response.data.message || 'Failed to update profile', style: 'error' });
            }
        } catch (error) {
            console.error(error);
            notify({ message: 'An error occurred while updating profile', style: 'error' });
        }
    };

    const handleEditClick = () => {
        openPopup({
            title: 'Edit Profile',
            widthClass: 'w-mm',
            content: <ProfileForm item={user} onSave={handleSave} />,
            actions: [
                { text: 'Cancel', className: 'btn-secondary', icon: icons.close, onClick: closePopup },
                { text: 'Save Changes', className: 'btn-primary', icon: icons.save, onClick: () => document.getElementById('Profile_form')?.requestSubmit() }
            ]
        });
    };

    const handlePasswordSave = async ({ username, oldPassword, newPassword }) => {
        try {
            const formData = new FormData();
            formData.append('un', username);
            formData.append('old_password', oldPassword);

            if (newPassword && newPassword.trim() !== '') {
                formData.append('password', newPassword);
            }

            const dynamicService = getService();
            const response = await dynamicService.update(user.id, formData);

            if (response.data.success) {
                showAlert({ style: 'success', title: 'User Credentials', content: 'Log-in Access was Successfully Updated', duration: 3000 })

                if (user.un !== username) { updateUserInContext({ ...user, un: username }); }
                return true;
            } else {
                if (response.data.message) {
                    return response.data.message;
                }
                notify({ message: response.data.message || 'Failed to update access', style: 'error' });
                return false;
            }
        } catch (error) {
            console.error(error);
            notify({ message: 'An error occurred while updating access', style: 'error' });
            return null;
        }
    };

    const handleChangePasswordClick = () => {
        openPopup({
            title: 'Change Log-in Access',
            widthClass: 'w-mm',
            content: <ChangePassword user={user} onSave={handlePasswordSave} />,
            actions: [
                { text: 'Cancel', className: 'btn-secondary', icon: icons.close, onClick: closePopup },
                { text: 'Save Changes', className: 'btn-primary', icon: icons.save, onClick: () => document.getElementById('ChangePassword_form')?.requestSubmit() }
            ]
        });
    };

    return (<div className='admin-pager'>
        <div className='profile-page'>
            <div className='pagelet'>
                <div className='profile-banner'>
                    <div className='profile-page-top'></div>
                    <div className='profile-page-body'>
                        <div className='profile-page-photo'> <img src={user.photoUrl} alt='Profile' /> </div>
                        <div className='profile-page-info'>
                            <span>
                                <h3>{`${user.fn} ${user.mn} ${user.sn}`.toLowerCase()}</h3>
                                <p>{`${user.kind === 'admin' ? 'Admin' : 'User'} | ${user.position}`.toLowerCase()}</p>
                            </span>
                            <button className='button btn-mobile-icon' onClick={handleEditClick}><Icon icon={icons.edit} /><p>Edit</p></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-column'>
                <div className='pagelet'>
                    <div className='pagelet-head'> <h4><Icon icon={icons.info} />Personal Information</h4> </div>
                    <div className='pagelet-in'>
                        <ul>
                            <li><Icon icon={icons.user} /><span><p>Full Name</p><h4>{`${user.fn} ${user.mn} ${user.sn}`.toUpperCase()}</h4></span></li>
                            <li><Icon icon={icons.userPlus} /><span><p>Gender</p><h4>{(user.gender === '1') ? 'Male' : (user.gender === '2') ? 'Female' : ''}</h4></span></li>
                            <li><Icon icon={icons.calendar} /><span><p>Birthday</p><h4>{moment(user.bday).format('MMMM DD, YYYY')}</h4></span></li>
                            <li><Icon icon={icons.phone} /><span><p>Phone</p><h4>{`${user.phone}`}</h4></span></li>
                            <li><Icon icon={icons.email} /><span><p>Email</p><h4>{`${user.email}`}</h4></span></li>
                            <li><Icon icon={icons.mapPin} /><span><p>Address</p><h4>{`${user.address}`}</h4></span></li>
                        </ul>
                    </div>
                </div>
                <div className='flex-row'>
                    <div className='pagelet'>
                        <div className='pagelet-head'> <h4><Icon icon={icons.lock} />Security Settings</h4> </div>
                        <div className='pagelet-in'>
                            <ul>
                                <li><Icon icon={icons.lockOpen} /><span><p>Change Log-in Access</p><h4>Update Username or Password</h4></span> <button className='button icon' onClick={handleChangePasswordClick}><Icon icon={icons.edit} /></button></li>
                                <li><Icon icon={icons.shieldCheck} /><span><p>Two-Factor Authentication</p><h4>Protect Account with Two-Factor Authentication</h4></span> <div className='toggle-switch'> <label><input name='otp_enabled' type='checkbox' checked={toggles.otp} onChange={handleToggle('otp')} /><span></span></label> </div> </li>
                            </ul>
                        </div>
                    </div>
                    <div className='pagelet'>
                        <div className='pagelet-head'> <h4><Icon icon={icons.notifications} />Alerts and Notifications</h4> </div>
                        <div className='pagelet-in'>
                            <ul>
                                <li><Icon icon={icons.calendar} /><span><p>Event Updates</p><h4>Receive important events and activities</h4></span> <div className='toggle-switch'> <label><input name='event_enabled' type='checkbox' checked={toggles.event} onChange={handleToggle('event')} /><span></span></label> </div> </li>
                                <li><Icon icon={icons.notifications} /><span><p>System Notifications</p><h4>Stay updated with important system alerts</h4></span> <div className='toggle-switch'> <label><input name='notification_enabled' type='checkbox' checked={toggles.notification} onChange={handleToggle('notification')} /><span></span></label> </div> </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>)
};
export default Profile;