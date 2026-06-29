import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeaderTabProvider } from '../../context/HeaderTabContext';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../assets/css/admin.css';
import '../../assets/css/delete.css';

const AdminLayout = () => {
    const {
        user,
        settings,
        settingsTimestamp,
        logout,
        isMinimized,
        isDarkMode,
        isPremium,
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
        document.body.classList.remove('web-body'); document.body.classList.add('admin-body');
        if (isDarkMode) { document.body.classList.add('dark-mode'); }
        else { document.body.classList.remove('dark-mode'); }
        if (isPremium) { document.body.classList.add('premium-theme'); }
        else { document.body.classList.remove('premium-theme'); }
    }, [isDarkMode, isPremium]);

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
                        isPremium={isPremium}
                    />
                    <section className="page-content">
                        <div className='app-body'>
                            <Outlet />
                        </div>
                        <div className="app-foot">
                            <div className='app-foot-info'>&copy;2023. <b>{settings?.system}</b> | ver. {settings?.version} All Rights Reserved.</div>
                        </div>
                    </section>
                </main>
            </div>
        </HeaderTabProvider>);
};

export default AdminLayout;