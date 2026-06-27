import { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import api from '../../api/api';
import { useNotifier } from '../../context/NotificationContext';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { FormInput, FormToggle } from '../../components/common/FormFields';

const Settings = () => {
    const { notify } = useNotifier();
    const { openPopup, closePopup } = useModal();
    const { user, refreshSettings, settingsTimestamp } = useAuth();
    // Fallback timestamp if not in context yet
    const timestamp = settingsTimestamp || Date.now();

    const TOGGLE_CONFIG = {
        otp: {
            title: 'Two-Factor Authentication',
            label: 'Two-Factor',
            messages: {
                enable: 'Enabling Two-Factor Authentication adds a significant layer of security to your account. You will be required to provide a verification code each time you log in. Are you sure you want to proceed?',
                disable: 'Disabling Two-Factor Authentication will lower the security of your account, making it more vulnerable to unauthorized access. Are you sure you want to turn this off?'
            }
        },
        whitelist: {
            title: 'IP Whitelist',
            label: 'Whitelist',
            messages: {
                enable: 'Enabling the IP Whitelist will restrict access to the system to specific IP addresses. Do you want to proceed?',
                disable: 'Disabling the IP Whitelist will allow access from any IP address. Are you sure you want to turn this off?'
            }
        }
    };

    const [settings, setSettings] = useState({
        system: '',
        version: '',
        otp: false,
        whitelist: false,
        logo: '',
        dashboard_logo: ''
    });

    const [tempFiles, setTempFiles] = useState({ logo: null, dashboard: null });
    const [previews, setPreviews] = useState({ logo: '', dashboard: '' });
    const [isDragging, setIsDragging] = useState({ logo: false, dashboard: false });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async (e) => {
        if (e) e.preventDefault();
        try {
            setLoading(true);
            const response = await api.get('/api/web/settings');
            if (response.data.success) {
                const s = response.data.settings;
                const fetchedSettings = {
                    system: s.system || '',
                    version: s.version || '',
                    otp: s.otp === 1 || s.otp === '1',
                    whitelist: s.whitelist === 1 || s.whitelist === '1',
                    logo: s.logo || '',
                    dashboard_logo: s.dashboard_logo || ''
                };
                setSettings(fetchedSettings);
                setPreviews({
                    logo: s.logo ? `/defaults/logo/${s.logo}?t=${timestamp}` : '/defaults/no-image.webp',
                    dashboard: s.dashboard_logo ? `/defaults/dashboard/${s.dashboard_logo}?t=${timestamp}` : '/defaults/no-image.webp'
                });
            }
        } catch (error) {
            notify({ style: 'error', message: 'Failed to fetch settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const processFile = (type, file) => {
        if (!file || !file.type.startsWith('image/')) {
            notify({ style: 'error', message: 'Please select a valid image file' });
            return;
        }
        setTempFiles(prev => ({ ...prev, [type]: file }));
        setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    };

    const handleFileChange = (type, e) => {
        const file = e.target.files[0];
        processFile(type, file);
    };

    const handleDrag = (type, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragover' || e.type === 'dragenter') {
            setIsDragging(prev => ({ ...prev, [type]: true }));
        } else if (e.type === 'dragleave' || e.type === 'drop') {
            setIsDragging(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleDrop = (type, e) => {
        handleDrag(type, e);
        const file = e.dataTransfer.files[0];
        processFile(type, file);
    };

    const updateToggle = async (key, newValue) => {
        try {
            const val = newValue ? 1 : 0;
            const response = await api.put('/api/web/settings', { key, value: val });

            if (response.data.success) {
                setSettings(prev => ({ ...prev, [key]: newValue }));
                const action = newValue ? 'Enabled' : 'Disabled';
                notify({ title: TOGGLE_CONFIG[key].label, message: `${action} Successfully`, style: newValue ? 'success' : 'warning' });
                closePopup();
            } else {
                notify('error', response.data.message || 'Failed to update toggle');
            }
        } catch (error) {
            console.error(error);
            notify('error', 'Failed to update toggle');
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

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        try {
            setSaving(true);
            if (tempFiles.logo) {
                const formData = new FormData();
                formData.append('logo', tempFiles.logo);
                formData.append('type', 'project');
                await api.post('/api/web/upload-logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }

            if (tempFiles.dashboard) {
                const formData = new FormData();
                formData.append('logo', tempFiles.dashboard);
                formData.append('type', 'dashboard');
                await api.post('/api/web/upload-logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }

            const textKeys = ['system', 'version'];
            for (const key of textKeys) {
                await api.put('/api/web/settings', { key, value: settings[key] });
            }

            notify({ style: 'success', message: 'Global Settings updated successfully' });
            setTempFiles({ logo: null, dashboard: null });
            await refreshSettings(); // Update global context immediately
            fetchSettings(); // Refresh local state
        } catch (error) {
            console.error(error);
            notify({ style: 'error', message: 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-pager">
            <header className="admin-pager-head">
                <div className='admin-pager-title'> <span><h2>Site-Wide Settings</h2><p>Global Settings and Configurations</p></span> </div>
            </header>
            <div className='admin-pager-body'>
                <div className='settings-wrap'>
                    <div className='pagelet'>
                        <div className='pagelet-head'> <h4><Icon icon={icons.info} /> System Information</h4> </div>
                        <div className='pagelet-in form-case'>
                            <div className='form-row'>
                                <div className='settings-logo-case'>
                                    <p>Project Logo</p>
                                    <div className={`settings-logo ${isDragging.logo ? 'dragging' : ''}`} onDragOver={(e) => handleDrag('logo', e)} onDragEnter={(e) => handleDrag('logo', e)} onDragLeave={(e) => handleDrag('logo', e)} onDrop={(e) => handleDrop('logo', e)}>
                                        <img src={previews.logo} alt='logo' />
                                        <label htmlFor='logo-upload'><Icon icon={icons.edit} /></label>
                                        <input type='file' id='logo-upload' accept='image/*' onChange={(e) => handleFileChange('logo', e)} style={{ display: 'none' }} />
                                    </div>
                                    <small>128x128 px (Favicon/Login)</small>
                                </div>
                                <div className='settings-logo-case logo-dashboard'>
                                    <p>Dashboard Logo</p>
                                    <div className={`settings-logo ${isDragging.dashboard ? 'dragging' : ''}`} onDragOver={(e) => handleDrag('dashboard', e)} onDragEnter={(e) => handleDrag('dashboard', e)} onDragLeave={(e) => handleDrag('dashboard', e)} onDrop={(e) => handleDrop('dashboard', e)}>
                                        <img src={previews.dashboard} alt='logo' />
                                        <label htmlFor='dashboard-upload'><Icon icon={icons.edit} /></label>
                                        <input type='file' id='dashboard-upload' accept='image/*' onChange={(e) => handleFileChange('dashboard', e)} style={{ display: 'none' }} />
                                    </div>
                                    <small>128x250 px - Sidebar/Header</small>
                                </div>
                            </div>
                            <div className='form-dvr'></div>
                            <div className='form-row'>
                                <div className='w5'>
                                    <FormInput label='System Name' name='system' value={settings.system} onChange={handleChange} required placeholder='System Name' />
                                </div>
                                <div className='w5'>
                                    <FormInput label='Version Number' name='version' value={settings.version} onChange={handleChange} placeholder='1.0.0' />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='w5'>
                                    <FormToggle label='Two-Factor Authentication' name='otp' checked={settings.otp} onChange={handleToggle('otp')} description='Protect accounts with secondary verification code.' className='toggle-case' />
                                </div>
                                <div className='w5'>
                                    <FormToggle label='Whitelist Verification' name='whitelist' checked={settings.whitelist} onChange={handleToggle('whitelist')} description='Restrict: Authorized IP addresses only.' className='toggle-case' />
                                </div>
                            </div>
                        </div>
                        <div className='pagelet-foot'>
                            <button type='button' className='button btn-secondary' disabled={loading || saving} onClick={fetchSettings}><Icon icon={icons.close} />Reset</button>
                            <button type='button' className='button' disabled={loading || saving} onClick={handleSave}>
                                <Icon icon={saving ? icons.refresh : icons.send} className={saving ? 'ani-spin' : ''} />
                                {saving ? 'Saving...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default Settings;
