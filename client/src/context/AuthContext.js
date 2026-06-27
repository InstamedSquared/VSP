import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { userPreferenceService } from '../services/user.service';
import api, { setupCsrf, resetSessionController } from '../api/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState(null);
    const [settingsTimestamp, setSettingsTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    const applyCacheBusting = (userData) => {
        if (userData && userData.photoUrl) {
            const url = new URL(userData.photoUrl, window.location.origin);
            url.searchParams.set('t', Date.now());
            userData.photoUrl = url.toString();
        }
        return userData;
    };

    useEffect(() => {
        const initializeAuth = async () => {
            // 1. Always fetch public settings first (branding, logo, system name)
            try {
                const response = await api.get('/api/web/settings');
                if (response.data.success) {
                    setSettings(response.data.settings);
                    setSettingsTimestamp(Date.now());
                }
            } catch (error) {
                console.error('Failed to fetch public settings:', error);
            }

            // 2. Then check auth state if we think we might be logged in
            const shouldCheckServerAuth = localStorage.getItem('isLoggedIn') === '1';
            if (shouldCheckServerAuth) {
                try {
                    const userResponse = await api.get('/api/auth/user');
                    if (userResponse.data.success) {
                        const systemData = userResponse.data.system;
                        const userData = applyCacheBusting(systemData.user);
                        
                        setUser(userData);
                        setIsMinimized(userData.sidebar === 1);
                        setIsDarkMode(userData.dark === 1);
                        setIsPremium(userData.dark === 2);
                        if (systemData.settings) { setSettings(systemData.settings); }
                        await setupCsrf();
                    }
                }
                catch (error) { 
                    console.log('Not authenticated on initial load.'); 
                    setUser(null); 
                    try { localStorage.removeItem('isLoggedIn'); } catch (e) { /* ignore */ }
                }
            } else {
                setUser(null);
            }
            
            setLoading(false);
        };
        initializeAuth();
    }, []);

    useEffect(() => {
        const handleGlobalLogout = () => {
            setUser(null);
            try { localStorage.removeItem('isLoggedIn'); } catch (e) { /* ignore */ }
        };
        window.addEventListener('app:logged-out', handleGlobalLogout);
        return () => { window.removeEventListener('app:logged-out', handleGlobalLogout); };
    }, []);

    useEffect(() => {
        const onStorage = (ev) => { if (ev.key === 'isLoggedIn' && ev.newValue !== '1') { setUser(null); } };
        window.addEventListener('storage', onStorage);
        return () => { window.removeEventListener('storage', onStorage); };
    }, []);

    const login = useCallback(async (username, password, rememberMe = false) => {
        try {
            const loginResponse = await api.post('/auth/login', { username, password, rememberMe });

            if (loginResponse.data.success) {
                // Check if OTP is required
                if (loginResponse.data.requiresOtp) {
                    return {
                        success: true,
                        requiresOtp: true,
                        tempToken: loginResponse.data.tempToken,
                        message: loginResponse.data.message
                    };
                }

                // Normal login flow
                const systemData = loginResponse.data.system;
                const userData = applyCacheBusting(systemData.user);

                setUser(userData);
                setIsMinimized(userData.sidebar === 1);
                setIsDarkMode(userData.dark === 1);
                setIsPremium(userData.dark === 2);

                setSettings(systemData.settings);

                await setupCsrf();

                try { localStorage.setItem('isLoggedIn', '1'); } catch (e) { /* ignore */ }
                return { success: true, user: userData, message: 'Login successful!' };
            }
            else {
                try { localStorage.removeItem('isLoggedIn'); } catch (e) { /* ignore */ }
                return { success: false, message: loginResponse.data.message };
            }
        }
        catch (error) {
            try { localStorage.removeItem('isLoggedIn'); } catch (e) { /* ignore */ }

            let message = 'A network error occurred.';
            if (error.response) {
                const responseData = error.response.data;
                if (typeof responseData === 'object' && responseData !== null && responseData.message) { message = responseData.message; }
                else if (typeof responseData === 'string') { message = responseData; }
            }
            return { success: false, message: message };
        }
    }, []);

    const logout = useCallback(async () => {
        try { await api.post('/auth/logout'); }
        catch (error) { console.error('Logout failed on server, clearing client state anyway:', error); }
        finally {
            setUser(null);
            try { localStorage.removeItem('isLoggedIn'); } catch (e) { /* ignore */ }
            try { resetSessionController(); } catch (e) { /* ignore */ }
        }
    }, []);

    const updateUserInContext = useCallback((updatedFields) => { if (user) { setUser(currentUser => ({ ...currentUser, ...updatedFields })); } }, [user]);

    const toggleSidebar = useCallback(async () => {
        const newMinimizedState = !isMinimized;
        setIsMinimized(newMinimizedState);
        try { await userPreferenceService.updatePreferences({ sidebar: newMinimizedState ? 1 : 0 }); updateUserInContext({ sidebar: newMinimizedState ? 1 : 0 }); }
        catch (error) { console.error('Failed to save sidebar preference:', error); setIsMinimized(!newMinimizedState); }
    }, [isMinimized, updateUserInContext]);

    const toggleDarkMode = useCallback(async () => {
        let nextTheme = 0;
        if (!isDarkMode && !isPremium) nextTheme = 1;      // Light -> Dark
        else if (isDarkMode && !isPremium) nextTheme = 2;  // Dark -> Premium
        else nextTheme = 0;                                // Premium -> Light

        setIsDarkMode(nextTheme === 1);
        setIsPremium(nextTheme === 2);

        try { 
            await userPreferenceService.updatePreferences({ dark: nextTheme }); 
            updateUserInContext({ dark: nextTheme }); 
        }
        catch (error) { 
            console.error('Failed to save theme preference:', error); 
            // Rollback (simplified)
            setIsDarkMode(isDarkMode);
            setIsPremium(isPremium);
        }
    }, [isDarkMode, isPremium, updateUserInContext]);

    const refreshSettings = useCallback(async () => {
        try {
            const response = await api.get('/api/web/settings');
            if (response.data.success) {
                setSettings(response.data.settings);
                setSettingsTimestamp(Date.now());
            }
        } catch (error) {
            console.error('Failed to refresh global settings:', error);
        }
    }, []);

    const verifyOtp = useCallback(async (tempToken, otp, rememberMe = false) => {
        try {
            const response = await api.post('/auth/verify-otp', { tempToken, otp, rememberMe });

            if (response.data.success) {
                const systemData = response.data.system;
                const userData = applyCacheBusting(systemData.user);

                setUser(userData);
                setIsMinimized(userData.sidebar === 1);
                setIsDarkMode(userData.dark === 1);
                setIsPremium(userData.dark === 2);
                setSettings(systemData.settings);

                await setupCsrf();

                try { localStorage.setItem('isLoggedIn', '1'); } catch (e) { /* ignore */ }
                return { success: true, user: userData, message: 'OTP verified successfully!' };
            }
            else {
                return { success: false, message: response.data.message };
            }
        }
        catch (error) {
            let message = 'A network error occurred.';
            if (error.response) {
                const responseData = error.response.data;
                if (typeof responseData === 'object' && responseData !== null && responseData.message) { message = responseData.message; }
                else if (typeof responseData === 'string') { message = responseData; }
            }
            return { success: false, message: message };
        }
    }, []);

    const resendOtp = useCallback(async (tempToken) => {
        try {
            const response = await api.post('/auth/resend-otp', { tempToken });
            return response.data;
        }
        catch (error) {
            let message = 'A network error occurred.';
            if (error.response) {
                const responseData = error.response.data;
                if (typeof responseData === 'object' && responseData !== null && responseData.message) { message = responseData.message; }
                else if (typeof responseData === 'string') { message = responseData; }
            }
            return { success: false, message: message };
        }
    }, []);

    const value = useMemo(() => ({
        user,
        settings,
        settingsTimestamp,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        isMinimized,
        toggleSidebar,
        isDarkMode,
        isPremium,
        toggleDarkMode,
        updateUserInContext,
        refreshSettings,
        verifyOtp,
        resendOtp
    }), [user, loading, isMinimized, isDarkMode, login, logout, toggleSidebar, toggleDarkMode, updateUserInContext, settings, settingsTimestamp, refreshSettings, verifyOtp, resendOtp]);

    if (loading) {
        return (<div className='page-loading-case'><div className='page-loading'>
            <div className='loader-line-scale'><div></div><div></div><div></div><div></div><div></div></div>
            <h3>Loading Application...</h3><p>Please wait while we secure your session.</p>
        </div></div>);
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>);
};