import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import { icons } from '../../config/icons';

const adminGroup = {
};

const empGroup = {
    tasks: [{
        title: 'Tasks', icon: icons.list, links: [
            { to: '/employee/tasks/all', label: 'All Tasks' },
            { to: '/employee/tasks/pending', label: 'Pending' },
        ],
    },],
};

const clientGroup = {
    // Clients has it's own sidebar and layout, this is just a sample
};


const Sidebar = ({ user, settings, settingsTimestamp, isMinimized, toggleSidebar, handleLogout }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [openGroups, setOpenGroups] = useState({});
    const [activeGroup, setActiveGroup] = useState(null);

    useEffect(() => {
        let activeKey = null;
        let currentGroupConfig = user.kind === 'admin' ? adminGroup : user.kind === 'employee' ? empGroup : clientGroup;

        Object.keys(currentGroupConfig).forEach((key) => { currentGroupConfig[key].forEach((grp) => { if (grp.links.some((link) => currentPath.startsWith(link.to))) { activeKey = key; } }); });

        setActiveGroup(activeKey);
        if (activeKey) { setOpenGroups((prev) => ({ ...prev, [activeKey]: true })); }

    }, [currentPath, user]);

    const handleLinkClick = () => { if (window.innerWidth <= 800) { toggleSidebar(); } };

    const toggleGroup = (key) => { setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] })); };

    const renderGroup = (key) => {
        let currentGroupConfig = user.kind === 'admin' ? adminGroup : user.kind === 'employee' ? empGroup : clientGroup;
        if (!currentGroupConfig[key]) { return null; }

        return currentGroupConfig[key].map((group, i) => (
            <div key={`${key}-${i}`} className={`g-sidebar ${openGroups[key] ? 'gbar_tog' : ''} ${activeGroup === key ? 'gbar_act' : ''}`}>
                <span tabIndex='0' onClick={() => toggleGroup(key)}> <Icon icon={group.icon} />
                    <p>{group.title}</p> <Icon icon={icons.chevronRight} className='sidebar-arrow' />
                </span>
                <ul> {group.links.map((link, j) => (<li key={`${key}-${i}-${j}`}> <NavLink onClick={handleLinkClick} to={link.to} className={({ isActive }) => isActive ? 'gbar-active' : ''}> <i></i> <p>{link.label}</p> </NavLink> </li>))} </ul>
            </div>));
    };

    return (
        <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
            <div className='sidebar-content'>
                <div className='sidebar-head'>
                    <img src={settings?.dashboard_logo ? `/defaults/dashboard/${settings.dashboard_logo}?t=${settingsTimestamp}` : `/defaults/no-image.webp`} alt='Logo' className='logo' loading='lazy' />
                    <h2>{settings?.system}</h2>
                </div>
                <nav className='sidebar-nav scrollbar-admin'>
                    {user?.kind === 'admin' && (
                        <>
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/admin' end className={({ isActive }) => isActive ? 'sidebar-active' : ''}> <Icon icon={icons.layoutDashboard} /> <p>Dashboard</p> </NavLink> </div>

                            <div className='sidebar-lbl'>ACCOUNTS</div>
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/admin/users' className={({ isActive }) => (isActive ? 'sidebar-active' : '')}> <Icon icon={icons.users} /> <p>Users</p> </NavLink> </div>
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/admin/employees' className={({ isActive }) => (isActive ? 'sidebar-active' : '')}> <Icon icon={icons.idCard} /> <p>Employees</p> </NavLink> </div>
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/admin/clients' className={({ isActive }) => (isActive ? 'sidebar-active' : '')}> <Icon icon={icons.contact} /> <p>Clients</p> </NavLink> </div>

                            <div className='sidebar-lbl'>SETTINGS</div>
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/admin/settings' className={({ isActive }) => (isActive ? 'sidebar-active' : '')}> <Icon icon={icons.settings} /> <p>Settings</p> </NavLink> </div>
                            <div className='a-sidebar'> <a href='/cms' target='_blank' rel='noopener noreferrer' className='sidebar-link'> <Icon icon={icons.arrowRight} /> <p>CMS Console</p> </a> </div>
                        </>)}

                    {user?.kind === 'employee' && (
                        <>
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/employee' end className={({ isActive }) => isActive ? 'sidebar-active' : ''}> <Icon icon={icons.layoutDashboard} /> <p>Dashboard</p> </NavLink> </div>
                            <div className='sidebar-lbl'>WORK</div>
                            {renderGroup('tasks')}
                        </>)}

                    <div className='sidebar-lbl'>GENERAL</div>
                    <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to={`${`/${user?.kind}`}/profile`} className={({ isActive }) => (isActive ? 'sidebar-active' : '')}> <Icon icon={icons.profile} />
                        <p>Profile</p> </NavLink> </div>
                    <div className='a-sidebar'> <button onClick={handleLogout} className='sidebar-logout-btn'> <Icon icon={icons.logout} />
                        <p>Logout</p> </button> </div>
                </nav>
            </div>
            <div className='sidebar-overlay' onClick={handleLinkClick}></div>
        </aside>
    );
};

export default Sidebar;