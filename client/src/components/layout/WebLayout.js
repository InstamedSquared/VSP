import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import api from '../../api/api';

const WebLayout = () => {
    const [hasHeader, setHeader] = useState(true);
    const [hasFooter, setFooter] = useState(true);
    const [settings, setSettings] = useState(null);
    const [settingsTimestamp, setSettingsTimestamp] = useState(Date.now());
    const [isDarkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.classList.remove('admin-body'); document.body.classList.add('web-body');
        if (isDarkMode) { document.body.classList.add('dark-mode'); }
        else { document.body.classList.remove('dark-mode'); }
    }, [isDarkMode]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/api/web/settings');
                if (response.data.success) {
                    setSettings(response.data.settings);
                    setSettingsTimestamp(Date.now());
                }
            } catch (error) {
                console.error('Failed to fetch public settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const setPageConfig = useCallback((cfg) => {
        if (cfg.hasHeader !== undefined) setHeader(cfg.hasHeader);
        if (cfg.hasFooter !== undefined) setFooter(cfg.hasFooter);
    }, []);

    return (
        <div className='web-container'>
            {hasHeader && <Navbar settings={settings} settingsTimestamp={settingsTimestamp} setDarkMode={setDarkMode} />}
            <main className='page-content'><Outlet context={{ setHeader, setFooter, settings, setPageConfig }} /></main>
            {hasFooter && <Footer settings={settings} settingsTimestamp={settingsTimestamp} />}
        </div>);
};

export default WebLayout;