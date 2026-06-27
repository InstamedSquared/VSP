import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import { icons } from '../../config/icons';

const sideGroup = {
};

const Sidebar = ({ user, settings, settingsTimestamp, isMinimized, toggleSidebar, handleLogout }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [togGBar, setTogGBar] = useState({});
    const [actGBar, setActGBar] = useState(null);
    const togGroupbar = (key) => { setTogGBar((prev) => ({ ...prev, [key]: !prev[key] })); };

    useEffect(() => {
        let activeKey = null;
        Object.keys(sideGroup).forEach((key) => { sideGroup[key].forEach((grp) => { if (grp.links.some((link) => currentPath.startsWith(link.to))) { activeKey = key; } }); });
        setActGBar(activeKey);
        if (activeKey) { setTogGBar((prev) => ({ ...prev, [activeKey]: true })); }
    }, [currentPath]);

    const sidebarLinkClick = () => { if (window.innerWidth <= 800) toggleSidebar(); };

    const renderGroup = (key) => sideGroup[key]?.map((group, i) => (
        <div key={`${key}-${i}`} className={`g-sidebar ${togGBar[key] ? 'gbar_tog' : ''} ${actGBar === key ? 'gbar_act' : ''}`} >
            <span tabIndex='0' onClick={() => togGroupbar(key)}> <Icon icon={group.icon} /><p>{group.title}</p> <Icon icon={icons.chevronRight} className='sidebar-arrow' /> </span>
            <ul> {group.links.map((link, j) => (<li key={`${key}-${i}-${j}`}> <NavLink onClick={sidebarLinkClick} to={link.to} className={({ isActive }) => isActive ? 'gbar-active' : ''} > <i></i> <p>{link.label}</p> </NavLink> </li>))} </ul>
        </div>));

    return (
        <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
            <div className='sidebar-content'>
                <div className='sidebar-head'> <img src={settings?.dashboard_logo ? `/defaults/dashboard/${settings.dashboard_logo}?t=${settingsTimestamp}` : `/defaults/no-image.webp`} alt='Logo' className='logo' loading='lazy' /><h2>{settings?.system || 'Template'}</h2> </div>
                <nav className='sidebar-nav'>
                    <div className='a-sidebar'> <NavLink onClick={sidebarLinkClick} to='/client' end className={({ isActive }) => isActive ? 'sidebar-active' : ''} > <Icon icon={icons.layoutDashboard} /> <p>Dashboard</p> </NavLink> </div>

                    <div className='sidebar-lbl'>GENERAL</div>
                    <div className='a-sidebar'><NavLink onClick={sidebarLinkClick} to='/client/profile' end className={({ isActive }) => isActive ? 'sidebar-active' : ''} > <Icon icon={icons.profile} /> <p>Profile</p> </NavLink> </div>
                    <div className='a-sidebar'><NavLink onClick={sidebarLinkClick} to='/client/settings' className={({ isActive }) => (isActive ? 'sidebar-active' : '')}><Icon icon={icons.settings} /> <p>Settings</p></NavLink></div>
                    <div className='a-sidebar'><button onClick={handleLogout} className='sidebar-logout-btn'><Icon icon={icons.logout} /><p>Logout</p> </button> </div>
                </nav>
            </div>
            <div className='sidebar-overlay' onClick={sidebarLinkClick}></div>
        </aside>);
};

export default Sidebar;
