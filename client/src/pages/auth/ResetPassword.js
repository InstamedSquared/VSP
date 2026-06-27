import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifier } from '../../context/NotificationContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import api from '../../api/api';

const ResetPassword = () => {
    const { setHeader, setFooter } = useOutletContext();
    useEffect(() => { setHeader(false); setFooter(false); return () => setHeader(true); }, [setHeader, setFooter]);

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, settings } = useAuth();
    const { notify } = useNotifier();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    useEffect(() => { 
        if (isAuthenticated) { navigate('/'); } 
        if (!token) { notify({ style: 'error', message: 'Invalid or missing token.' }); navigate('/login'); } 
    }, [isAuthenticated, token, navigate, notify]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) { notify({ style: 'error', message: 'Passwords do not match.' }); return; }
        try {
            setLoading(true);
            const response = await api.post('/auth/reset-password', { token, password });
            if (response.data.success) { 
                notify({ style: 'success', message: 'Password reset successful!' }); 
                navigate('/login'); 
            }
            else { notify({ style: 'error', message: response.data.message || 'Reset failed.' }); }
        } catch (error) { notify({ style: 'error', message: 'An error occurred. Please try again.' }); }
        finally { setLoading(false); }
    };

    if (isAuthenticated) { return null; }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-logo'> <img src={settings?.logo ? `/defaults/logo/${settings.logo}` : '/defaults/no-image.webp'} alt='Logo' /> <span><h2>{settings?.system || 'TEMPLATE'}</h2><p>Description here</p></span> </div>
                <div className='pagelet'><div className='login-body'>
                    <div className='login-head'> <h2>Set New Password</h2><p>Please enter your new password below.</p> </div>

                    <form className='form-case' onSubmit={handleSubmit}>
                        <div className='input-case'><p>New Password</p>
                            <div className='input-group left right'>
                                <input type={showPassword ? 'text' : 'password'} placeholder='New Password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
                                <Icon icon={icons.key} className='input-icon' />
                                <Icon icon={showPassword ? icons.eyeSlash : icons.eye} className='input-icon' onClick={() => setShowPassword(!showPassword)} />
                            </div>
                        </div>
                        <div className='input-case'><p>Confirm New Password</p>
                            <div className='input-group left right'>
                                <input type={showConfirmPassword ? 'text' : 'password'} placeholder='Confirm New Password' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} required />
                                <Icon icon={icons.key} className='input-icon' />
                                <Icon icon={showConfirmPassword ? icons.eyeSlash : icons.eye} className='input-icon' onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                            </div>
                        </div>
                        <div className='login-buttons'>
                            <button type='submit' className='button' disabled={loading}> <Icon icon={icons.save} /> {loading ? 'Updating Password...' : 'Update Password'} </button>
                            <Link to='/login' >Back to Login</Link>
                        </div>
                    </form>
                </div></div>
            </div>
        </div>);
};

export default ResetPassword;