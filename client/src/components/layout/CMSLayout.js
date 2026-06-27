import React, { useEffect } from 'react';

import CmsSidebar from '../../cms/components/CmsSidebar';
import CmsProps from '../../cms/components/CmsProps';
import CmsHeader from '../../cms/components/CmsHeader';

import CmsCanvas from '../../cms/components/CmsCanvas';
import CmsFooter from '../../cms/components/CmsFooter';

import { CMSProvider } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';
import '../../assets/css/admin.css';
import '../../assets/cms/css/layout.css';
import '../../assets/cms/css/toolbar.css';
import '../../assets/cms/css/library.css';
import '../../assets/cms/css/components.css';
import '../../assets/cms/css/console.css';

const CMSLayout = () => {
    const { isDarkMode, isPremium } = useAuth();

    useEffect(() => {
        document.body.classList.remove('web-body');
        document.body.classList.add('admin-body');

        if (isDarkMode) { document.body.classList.add('dark-mode'); }
        else { document.body.classList.remove('dark-mode'); }

        if (isPremium) { document.body.classList.add('premium-theme'); }
        else { document.body.classList.remove('premium-theme'); }
    }, [isDarkMode, isPremium]);


    const [activeTab, setActiveTab] = React.useState(localStorage.getItem('cms_active_tab') || 'Design');
    const [isPropsCollapsed, setIsPropsCollapsed] = React.useState(localStorage.getItem('cms_props_collapsed') === 'true');

    useEffect(() => {
        localStorage.setItem('cms_active_tab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        localStorage.setItem('cms_props_collapsed', String(isPropsCollapsed));
    }, [isPropsCollapsed]);

    return (
        <div className='cms-container'>
            <CmsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className='cms-main'>
                <CmsHeader />
                <div className='cms-body'>
                    <CmsProps
                        activeTab={activeTab}
                        isCollapsed={isPropsCollapsed}
                        setIsCollapsed={setIsPropsCollapsed}
                    />
                    <div className={`cms-canva ${isPropsCollapsed ? 'expanded' : ''}`}>
                        <CmsCanvas />
                        <CmsFooter />
                    </div>
                </div>
            </main>
        </div>
    );
};





export default CMSLayout;
