import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import { icons } from '../../config/icons';

const adminGroup = {
    workforce: [{
        title: 'Workforce', icon: icons.users, links: [
            { to: '/admin/workforce/bench', label: 'Bench Status' },
            { to: '/admin/workforce/skills', label: 'Skills Inventory' },
            { to: '/admin/workforce/documents', label: 'HR Documents' },
            { to: '/admin/workforce/payslips', label: 'Payslips' },
        ],
    }],
    recruitment: [{
        title: 'Recruitment', icon: icons.userPlus, links: [
            { to: '/admin/recruitment/applicants', label: 'Applicants' },
            { to: '/admin/recruitment/pipeline', label: 'Pipeline' },
            { to: '/admin/recruitment/jobs', label: 'Job Postings' },
        ],
    }],
    operations: [{
        title: 'Operations', icon: icons.settings, links: [
            { to: '/admin/operations/client-requests', label: 'Client Requests' },
            { to: '/admin/operations/assignments', label: 'Staff Assignments' },
            { to: '/admin/operations/compliance', label: 'Compliance' },
            { to: '/admin/operations/announcements', label: 'Announcements' },
        ],
    }],
    finance: [{
        title: 'Finance', icon: icons.banking, links: [
            { to: '/admin/finance/invoices', label: 'Invoices' },
            { to: '/admin/finance/payroll', label: 'Payroll' },
        ],
    }],
    lms: [{
        title: 'Learning', icon: icons.book, links: [
            { to: '/admin/lms/courses', label: 'Course Catalog' }
        ],
    }],
};

const empGroup = {
    lms: [{
        title: 'Learning', icon: icons.book, links: [
            { to: '/employee/lms/courses', label: 'My Courses' },
            { to: '/employee/lms/progress', label: 'Progress' },
        ],
    }],
    hr: [{
        title: 'HR', icon: icons.user, links: [
            { to: '/employee/hr/documents', label: 'My Documents' },
            { to: '/employee/hr/payslips', label: 'My Payslips' },
            { to: '/employee/hr/leaves', label: 'Leave Requests' },
        ],
    }],
};

const clientGroup = {
    lms: [{
        title: 'Learning', icon: icons.book, links: [
            { to: '/client/lms/courses', label: 'Course Catalog' }
        ],
    }],
}; // Clients handled in SidebarClient.js


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
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/admin/operations/clients' className={({ isActive }) => (isActive ? 'sidebar-active' : '')}> <Icon icon={icons.contact} /> <p>Clients</p> </NavLink> </div>

                            <div className='sidebar-lbl'>MODULES</div>
                            {renderGroup('workforce')}
                            {renderGroup('recruitment')}
                            {renderGroup('operations')}
                            {renderGroup('finance')}
                            {renderGroup('lms')}

                            <div className='sidebar-lbl'>SETTINGS</div>
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/admin/settings' className={({ isActive }) => (isActive ? 'sidebar-active' : '')}> <Icon icon={icons.settings} /> <p>Settings</p> </NavLink> </div>
                            <div className='a-sidebar'> <a href='/cms' target='_blank' rel='noopener noreferrer' className='sidebar-link'> <Icon icon={icons.arrowRight} /> <p>CMS Console</p> </a> </div>
                        </>)}

                    {user?.kind === 'employee' && (
                        <>
                            <div className='a-sidebar'> <NavLink onClick={handleLinkClick} to='/employee' end className={({ isActive }) => isActive ? 'sidebar-active' : ''}> <Icon icon={icons.layoutDashboard} /> <p>Dashboard</p> </NavLink> </div>
                            
                            <div className='sidebar-lbl'>MODULES</div>
                            {renderGroup('lms')}
                            {renderGroup('hr')}
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