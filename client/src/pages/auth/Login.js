import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';

const Login = () => {

    const { setHeader, setFooter } = useOutletContext();
    useEffect(() => { setHeader(false); setFooter(false); return () => setHeader(true); }, [setHeader, setFooter]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, login, user, settings } = useAuth();
    const navigate = useNavigate();

    // Load remembered username on mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && user) {
            switch (user.kind) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'employee':
                    navigate('/employee');
                    break;
                case 'client':
                    navigate('/client');
                    break;
                default:
                    navigate('/'); // Fallback
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(username, password, rememberMe);
        setLoading(false);

        if (!result.success) {
            setError(result.message);
        } else {
            // Success OR OTP required - handle "Remember Me" persistence
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            if (result.requiresOtp) {
                // Redirect to OTP verification page
                navigate('/verify-otp', { state: { tempToken: result.tempToken, rememberMe, username } });
            }
        }
    };

    if (isAuthenticated) { return null; }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-logo'> <img src={settings?.logo ? `/defaults/logo/${settings.logo}` : '/defaults/no-image.webp'} alt='Logo' /> <span><h2>{settings?.system || 'TEMPLATE'}</h2><p>Description here</p></span> </div>
                <div className='pagelet'><div className='login-body'>
                    <div className='login-head'> <h2>Sign In</h2> <p>Don't have an account? <Link to='/signup' >Sign up here</Link> </p> </div>
                    <form className='form-case' onSubmit={handleLogin}>
                        <div className='input-case'><p>Username</p>
                            <div className='input-group left'>
                                <input type="text" placeholder="Username" autoFocus name='username' value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} required autoComplete='true' />
                                <Icon icon={icons.user} className="input-icon" />
                            </div>
                        </div>
                        <div className='input-case'><p>Password</p>
                            <div className='input-group left right'>
                                <input type={showPassword ? 'text' : 'password'} placeholder="Password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
                                <Icon icon={icons.key} className="input-icon" />
                                <Icon icon={showPassword ? icons.eyeSlash : icons.eye} className="input-icon" onClick={() => setShowPassword(!showPassword)} />
                            </div>
                        </div>
                        {error && (<p className='invalid'>{error}</p>)}
                        <div className='login-actions'>
                            <span>
                                <label><input type="checkbox" name="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember me</label>
                                <Link to="/forgot-password" >Forgot Password?</Link>
                            </span>
                            <button type="submit" className="button" disabled={loading}> <Icon icon={icons.login} /> {loading ? 'Logging In...' : 'Login'} </button>
                            <Link to='/' >Back to Home</Link>
                        </div>
                    </form>
                </div></div>
            </div>
        </div>);
};

export default Login;