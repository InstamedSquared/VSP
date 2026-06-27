import React from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { useAuth } from '../../context/AuthContext';

const CmsSidebar = ({ activeTab, setActiveTab }) => {
    const { settings, settingsTimestamp } = useAuth();
    const navItems = [
        { id: 'Design', label: 'Design', icon: icons.layoutGrid, to: '/cms/appearance' },
        { id: 'Templates', label: 'Template', icon: icons.layout, to: '/cms/templates' },
        { id: 'Pages', label: 'Pages', icon: icons.fileText, to: '/cms/pages' },
        { id: 'Sections', label: 'Sections', icon: icons.layoutGrid, to: '/cms/sections' },
        { id: 'Blocks', label: 'Blocks', icon: icons.layers, to: '/cms/blocks' },
        { id: 'Media', label: 'Media', icon: icons.fileImage, to: '/cms/media' },
        { id: 'Tools', label: 'Settings', icon: icons.settingsAlt, to: '/cms/tools' },
    ];

    return (
        <aside className='cms-sidebar'>
            <header><img src={settings?.dashboard_logo ? `/defaults/dashboard/${settings.dashboard_logo}?t=${settingsTimestamp}` : `/defaults/no-image.webp`} alt='Logo' className='logo' loading='lazy' /></header>
            <nav className='scrollbar-admin'>
                <ul>
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={activeTab === item.id ? 'active' : ''}
                            >
                                <Icon icon={item.icon} />
                                <p>{item.label}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default CmsSidebar;
