import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifier } from '../../context/NotificationContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import api from '../../api/api';

const ForgotPassword = () => {
    const { setHeader, setFooter } = useOutletContext();
    useEffect(() => { setHeader(false); setFooter(false); return () => setHeader(true); }, [setHeader, setFooter]);

    const navigate = useNavigate();
    const { isAuthenticated, settings } = useAuth();
    const { notify } = useNotifier();

    const [un, setUn] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (isAuthenticated) { navigate('/'); } }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.post('/auth/forgot-password', { un, email });
            if (response.data.success) { notify({ style: 'success', message: 'If the account exists, a reset link will be sent to the email.' }); navigate('/login'); }
            else { notify({ style: 'error', message: response.data.message || 'Request failed' }); }
        } catch (error) { notify({ style: 'error', message: 'An error occurred. Please try again.' }); }
        finally { setLoading(false); }
    };

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-logo'> <img src={settings?.logo ? `/defaults/logo/${settings.logo}` : '/defaults/no-image.webp'} alt='Logo' /> <span><h2>{settings?.system || 'TEMPLATE'}</h2><p>Description here</p></span> </div>
                <div className='pagelet'><div className='login-body'>
                    <div className='login-head'> <h2>Reset Password</h2><p>Don't have an account? <Link to='/signup' >Sign up here</Link> </p> </div>
                    <form className='form-case' onSubmit={handleSubmit}>
                        <p className='info'>Please enter your Email Address and we'll send you a link to reset your password.</p>
                        <div className='input-case'><p>Email Address</p>
                            <div className='input-group left'>
                                <input type='email' placeholder='Enter your email' autoFocus name='email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
                                <Icon icon={icons.user} className='input-icon' />
                            </div>
                        </div>
                        <div className='login-buttons'>
                            <button type='submit' className='button' disabled={loading}> <Icon icon={icons.key} /> {loading ? 'Sending Reset Link...' : 'Send Reset Link'} </button>
                            <Link to='/login' >Back to Login</Link>
                        </div>
                    </form>
                </div></div>
            </div>
        </div>);
};

export default ForgotPassword;