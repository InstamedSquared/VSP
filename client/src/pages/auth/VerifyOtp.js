import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifier } from '../../context/NotificationContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';

const VerifyOtp = () => {
    const { setHeader, setFooter } = useOutletContext();
    useEffect(() => { setHeader(false); setFooter(false); return () => setHeader(true); }, [setHeader, setFooter]);

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, verifyOtp, resendOtp, settings } = useAuth();
    const { notify } = useNotifier();

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300);

    const [tempToken, setTempToken] = useState(location.state?.tempToken);
    const rememberMe = location.state?.rememberMe || false;
    const initialUsername = location.state?.username || '';

    useEffect(() => { 
        if (isAuthenticated) { navigate('/'); } 
        if (!tempToken) { navigate('/login'); } 
    }, [isAuthenticated, tempToken, navigate]);

    // Countdown timer for OTP expiration
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Cooldown timer for resend button
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!otp) { setError('Please enter the OTP code.'); return; }
        if (otp.length !== 6) { setError('OTP must be 6 digits.'); return; }

        setLoading(true);

        try {
            const result = await verifyOtp(tempToken, otp, rememberMe);
            setLoading(false);

            if (!result.success) {
                setError(result.message);
                notify({ style: 'error', message: result.message });
            } else {
                // Success - handle "Remember Me" persistence
                if (rememberMe && initialUsername) {
                    localStorage.setItem('rememberedUsername', initialUsername);
                } else if (!rememberMe) {
                    localStorage.removeItem('rememberedUsername');
                }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'A network error occurred. Please try again.';
            setError(message);
            notify({ style: 'error', message: message });
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await resendOtp(tempToken);
            setLoading(false);

            if (result.success) {
                if (result.tempToken) setTempToken(result.tempToken);
                setTimeLeft(300); // Reset expiration timer
                setResendCooldown(60); // 60 seconds cooldown
                setSuccess('A new OTP has been sent to your email.');
                notify({ style: 'success', message: 'A new OTP has been sent to your email.' });
                setOtp(''); // Clear old OTP input
            } else {
                setError(result.message);
                notify({ style: 'error', message: result.message });
            }
        } catch (err) {
            setError('Failed to resend OTP. Please try logging in again.');
            notify({ style: 'error', message: 'Failed to resend OTP. Please try logging in again.' });
            setLoading(false);
        }
    };

    if (isAuthenticated) { return null; }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-logo'> <img src={settings?.logo ? `/defaults/logo/${settings.logo}` : '/defaults/no-image.webp'} alt='Logo' /> <span><h2>{settings?.system || 'TEMPLATE'}</h2><p>Description here</p></span> </div>
                <div className='pagelet'><div className='login-body'>
                    <div className='login-head'> <h2>Verify OTP</h2><p>Enter the code sent to your email</p> </div>
                    <form className='form-case' onSubmit={handleVerifyOtp}>
                        <p className='info'>A 6-digit verification code has been sent to your email address. Please enter it below to complete your login.</p>

                        <div className='input-case'><p>OTP Code</p>
                            <div className='input-group left'>
                                <input
                                    type='text'
                                    placeholder='000000'
                                    autoFocus
                                    name='otp'
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    disabled={loading || timeLeft <= 0}
                                    maxLength={6}
                                    required
                                />
                                <Icon icon={icons.key} className='input-icon' />
                            </div>
                        </div>

                        {timeLeft > 0 ? (
                            <p className='info' style={{ textAlign: 'center', color: '#666' }}>
                                Time remaining: <strong>{formatTime(timeLeft)}</strong>
                            </p>
                        ) : (
                            <p className='invalid' style={{ textAlign: 'center' }}>
                                OTP has expired. Please request a new one.
                            </p>
                        )}

                        {error && (<p className='invalid'>{error}</p>)}
                        {success && (<p className='success' style={{ textAlign: 'center', marginBottom: '1rem' }}>{success}</p>)}

                        <div className='login-buttons'>
                            <button type='submit' className='button' disabled={loading || timeLeft <= 0}> <Icon icon={icons.success} /> {loading ? 'Verifying...' : 'Verify OTP'} </button>
                            <button
                                type='button'
                                className='button btn-secondary'
                                onClick={handleResendOtp}
                                disabled={loading || resendCooldown > 0}
                            >
                                <Icon icon={icons.rotate} />
                                {resendCooldown > 0 ? ` Resend in ${resendCooldown}s` : ' Resend OTP'}
                            </button>
                            <Link to='/login'>Back to Login</Link>
                        </div>
                    </form>
                </div></div>
            </div >
        </div >
    );
};

export default VerifyOtp;
