import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeaderTabProvider } from '../../context/HeaderTabContext';
import Sidebar from './SidebarClient';
import Header from './Header';
import '../../assets/css/admin.css';

const ClientLayout = () => {
    const {
        user,
        settings,
        settingsTimestamp,
        logout,
        isMinimized,
        isDarkMode,
        toggleSidebar: toggleDbSidebar,
        toggleDarkMode: toggleDbDarkMode,
        loading: isAuthLoading
    } = useAuth();

    const navigate = useNavigate();
    const handleLogout = async (e) => { e.preventDefault(); await logout(); navigate('/login'); };

    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleToggleSidebar = () => {
        if (window.innerWidth <= 800) { setMobileSidebarOpen(!isMobileSidebarOpen); }
        else { toggleDbSidebar(); }
    };

    useEffect(() => {
        document.body.classList.remove('web-body'); document.body.classList.add('admin-body'); // You can create a 'client-body' class if needed
        if (isDarkMode) { document.body.classList.add('dark-mode'); }
        else { document.body.classList.remove('dark-mode'); }
    }, [isDarkMode]);

    if (isAuthLoading) { return <div>Loading User Settings...</div>; }

    return (
        <HeaderTabProvider>
            <div className={`admin-container ${isMobileSidebarOpen ? 'sidebar-mobile-open' : ''} ${isMinimized ? 'sidebar-minimized' : ''}`}>
                <Sidebar
                    user={user}
                    settings={settings}
                    settingsTimestamp={settingsTimestamp}
                    isMinimized={isMinimized}
                    toggleSidebar={handleToggleSidebar}
                    handleLogout={handleLogout}
                />
                <main className={`main-content ${profileOpen ? "adm_header_open" : ""}`}>
                    <Header
                        user={user}
                        settings={settings}
                        settingsTimestamp={settingsTimestamp}
                        handleLogout={handleLogout}
                        toggleSidebar={handleToggleSidebar}
                        isMinimized={isMinimized}
                        setProfileOpen={setProfileOpen}
                        profileOpen={profileOpen}
                        toggleDarkMode={toggleDbDarkMode}
                        isDarkMode={isDarkMode}
                    />
                    <section className="page-content">
                        <div className='app-body'>
                            <Outlet />
                        </div>
                        <div className="app-foot">
                            <div className='app-foot-info'>&copy;2023. <b>{settings?.system || 'Client Template'}</b> | ver. {settings?.version} All Rights Reserved.</div>
                        </div>
                    </section>
                </main>
            </div>
        </HeaderTabProvider>);
};

export default ClientLayout;