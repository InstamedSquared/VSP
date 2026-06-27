import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifier } from '../../context/NotificationContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import api from '../../api/api';
import useForm from '../../hooks/useForm';
import { FormInput } from '../../components/common/FormFields';

const Signup = () => {
    const { setHeader, setFooter } = useOutletContext();
    useEffect(() => { setHeader(false); setFooter(false); return () => setHeader(true); }, [setHeader, setFooter]);

    const navigate = useNavigate();
    const { isAuthenticated, settings } = useAuth();
    const { notify } = useNotifier();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const schema = {
        firstName: { required: true, label: 'First Name' },
        lastName: { required: true, label: 'Last Name' },
        email: { required: true, type: 'email', label: 'Email Address', validateOnChange: true },
        username: { required: true, label: 'Username' },
        password: { required: true, type: 'password', label: 'Password', validateOnChange: true },
        confirmPassword: { required: true, match: 'password', matchError: 'Passwords do not match', label: 'Confirm Password', validateOnChange: true }
    };

    const { values, errors, handleChange, handleSubmit, registerRef } = useForm({
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }, schema);

    useEffect(() => { if (isAuthenticated) { navigate('/'); } }, [isAuthenticated, navigate]);

    const handleSignup = async (formData) => {
        setApiError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('/auth/signup', {
                fn: formData.firstName,
                mn: formData.middleName,
                sn: formData.lastName,
                un: formData.username,
                email: formData.email,
                password: formData.password
            });
            if (response.data.success) { 
                notify({ style: 'success', message: 'Account created successfully! Please log in.' }); 
                setSuccess('Account created successfully! Redirecting...');
                setTimeout(() => navigate('/login'), 2000);
            }
            else { 
                setApiError(response.data.message || 'Signup failed'); 
                notify({ style: 'error', message: response.data.message || 'Signup failed' });
            }
        } catch (err) { 
            setApiError('An error occurred during signup');
            notify({ style: 'error', message: 'An error occurred during signup' }); 
        }
        finally { setLoading(false); }
    };

    return (
        <div className='login-page signup-page'>
            <div className='login-container'>
                <div className='login-logo'> <img src={settings?.logo ? `/defaults/logo/${settings.logo}` : '/defaults/no-image.webp'} alt='Logo' /> <span><h2>{settings?.system || 'TEMPLATE'}</h2><p>Description here</p></span> </div>
                <div className='pagelet'><div className='login-body'>
                    <div className='login-head'> <h2>Register</h2> <p>Already have an account? <Link to='/login' >Sign In</Link> | <Link to='/forgot-password' >Recover Password</Link> </p> </div>
                    <form className='form-case' noValidate onSubmit={handleSubmit(handleSignup)} autoComplete='off'>
                        <div className='form-row'>
                            <FormInput 
                                label="First Name" 
                                placeholder="First Name" 
                                name="firstName" 
                                value={values.firstName} 
                                error={errors.firstName} 
                                onChange={handleChange} 
                                iconLeft={icons.user} 
                                required 
                                disabled={loading} 
                            />
                            <FormInput 
                                label="Middle Name" 
                                placeholder="Middle Name" 
                                name="middleName" 
                                value={values.middleName} 
                                onChange={handleChange} 
                                iconLeft={icons.user} 
                                disabled={loading} 
                            />
                        </div>
                        <FormInput 
                            label="Last Name" 
                            placeholder="Last Name" 
                            name="lastName" 
                            value={values.lastName} 
                            error={errors.lastName} 
                            onChange={handleChange} 
                            iconLeft={icons.user} 
                            required 
                            disabled={loading} 
                        />
                        <FormInput 
                            label="Email Address" 
                            placeholder="Email Address" 
                            name="email" 
                            type="email" 
                            value={values.email} 
                            error={errors.email} 
                            onChange={handleChange} 
                            iconLeft={icons.email} 
                            inputRef={registerRef('email')} 
                            required 
                            disabled={loading} 
                        />
                        <div className='form-dvr'></div>

                        <FormInput 
                            label="Username" 
                            placeholder="Username" 
                            name="username" 
                            value={values.username} 
                            error={errors.username} 
                            onChange={handleChange} 
                            iconLeft={icons.user} 
                            required 
                            disabled={loading} 
                        />
                        <FormInput 
                            label="Password" 
                            placeholder="Password" 
                            name="password" 
                            type={showPassword ? 'text' : 'password'} 
                            value={values.password} 
                            error={errors.password} 
                            onChange={handleChange} 
                            iconLeft={icons.key} 
                            iconRight={showPassword ? icons.eyeSlash : icons.eye} 
                            onIconRightClick={() => setShowPassword(!showPassword)} 
                            required 
                            disabled={loading} 
                        />
                        <FormInput 
                            label="Confirm Password" 
                            placeholder="Confirm Password" 
                            name="confirmPassword" 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            value={values.confirmPassword} 
                            error={errors.confirmPassword} 
                            onChange={handleChange} 
                            iconLeft={icons.key} 
                            iconRight={showConfirmPassword ? icons.eyeSlash : icons.eye} 
                            onIconRightClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            required 
                            disabled={loading} 
                        />
                        
                        {apiError && (<p className='invalid'>{apiError}</p>)}
                        {success && (<p className='success'>{success}</p>)}
                        <div className='login-buttons'>
                            <button type='submit' className='button' disabled={loading}> <Icon icon={icons.user} /> {loading ? 'Creating Account...' : 'Sign Up'} </button>
                            <Link to='/login' >Back to Login</Link>
                        </div>
                    </form>
                </div></div>
            </div>
        </div>);
};

export default Signup;