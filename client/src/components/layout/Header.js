import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { userService } from '../../services/api.service';
import { useHeaderTab } from '../../context/HeaderTabContext';
import Icon from '../common/Icon';
import { icons } from '../../config/icons';

const Header = ({
    user, settings, handleLogout, toggleSidebar, setProfileOpen, profileOpen,
    toggleDarkMode, isDarkMode, isPremium,
    titleContent, centerContent, navContent
}) => {
    const profileRef = useRef(null);
    const [avatarUrl, setAvatarUrl] = useState('/defaults/avatar.png');
    const { headerTabs } = useHeaderTab();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const signal = controller.signal;
        let blobUrl = null;

        const fetchAvatar = async () => {
            if (user && user.photoUrl) {
                try {
                    const response = await userService.getPhoto(user.photoUrl, { signal });
                    blobUrl = URL.createObjectURL(response.data);
                    if (isMounted && !signal.aborted) { setAvatarUrl(blobUrl); }
                }
                catch (error) { if (!signal.aborted) { console.error('Failed to fetch user avatar:', error); if (isMounted) { setAvatarUrl('/defaults/avatar.png'); } } }
            }
            else { if (isMounted) { setAvatarUrl('/defaults/avatar.png'); } }
        };

        fetchAvatar();

        return () => {
            isMounted = false;
            controller.abort();
            if (blobUrl) { URL.revokeObjectURL(blobUrl); }
        };
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => { if (profileRef.current && !profileRef.current.contains(event.target)) { setProfileOpen(false); } };
        if (profileOpen) { document.addEventListener('mousedown', handleClickOutside); }
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [profileOpen, setProfileOpen]);

    return (
        <header className='header'>
            <div className='header-body'>
                <div className='head-title'>
                    <button onClick={toggleSidebar} className='sidebar-toggle-btn'><p></p><u></u><b></b></button>
                    {titleContent || <h2>{settings?.system}</h2>}
                </div>
                {centerContent}
                <div className='head-navs'>
                    {navContent ? navContent : (
                        <>
                            <button className='head-btn'><Icon icon={icons.notifications} /></button>
                            <button className='head-btn'><Icon icon={icons.help} /></button>
                        </>
                    )}
                    {user && (
                        <div className='user-profile' ref={profileRef} >
                            <button className='user-profile-btn' onClick={() => setProfileOpen(!profileOpen)}>
                                <img src={avatarUrl} alt={user.un || 'User'} loading='lazy' />
                            </button>
                            <div className='user-profile-chevron'><Icon icon={icons.chevronDown} /></div>
                            <div className='user-profile-info'>
                                <ul>
                                    <li><NavLink to='/admin/profile'><Icon icon={icons.profile} /> <p>Profile</p></NavLink></li>
                                    <li><NavLink to='/admin/settings'><Icon icon={icons.settings} /> <p>Settings</p></NavLink></li>
                                    <li><button onClick={toggleDarkMode} ><Icon icon={isPremium ? icons.settingsAlt : (isDarkMode ? icons.view : icons.eyeSlash)} /> <p>{isPremium ? 'Premium' : (isDarkMode ? 'Dark' : 'Light')}</p></button></li>
                                    <div className='user-profile-dvr'></div>
                                    <li><button onClick={handleLogout}><Icon icon={icons.logout} /> <p>Logout</p></button></li>
                                </ul>
                            </div>
                        </div>)}
                </div>
            </div>
            {headerTabs && (
                <div className='tab-case'>
                    {headerTabs.label && <div className='header-tab-label'>{headerTabs.label}</div>}
                    <ul className='nav-wrap'>
                        {headerTabs.tabs.map((tab, index) => (
                            <li key={index} className='nav-item'>
                                <Link to={tab.to || '#'} className={`nav-link ${tab.isActive ? 'active' : ''}`} onClick={(e) => { if (!tab.to) e.preventDefault(); if (tab.onClick) tab.onClick(); }} > {tab.label} </Link>
                            </li>
                        ))}
                    </ul>
                </div>)}
        </header>);
};

export default Header;