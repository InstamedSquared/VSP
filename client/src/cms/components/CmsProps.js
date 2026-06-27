import React from 'react';
import Icon from "../../components/common/Icon";
import { icons } from "../../config/icons";
import TemplateGallery from './TemplateGallery';
import SectionNavigator from './SectionNavigator';
import BlockLibrary from './BlockLibrary';
import PageManager from './PageManager';
import MediaManager from './MediaManager';

const CmsProps = ({ activeTab, isCollapsed, setIsCollapsed }) => {
    const renderContent = () => {
        switch (activeTab) {
            case 'Design':
                return <div>Theme Preview (Coming Soon)</div>;
            case 'Templates':
                return <div>Template Preview (Coming Soon)</div>;
            case 'Pages':
                return <PageManager />;
            case 'Sections':
                return <SectionsTab />;
            case 'Blocks':
                return <BlockLibrary />;
            case 'Media':
                return <MediaManager />;
            case 'Settings':
                return <div>Site Settings Preview (Coming Soon)</div>;
            default:
                return <div>{activeTab} Content</div>;
        }
    };

    return (
        <div className={`cms-props ${isCollapsed ? 'collapsed' : ''}`}>
            <button id='props_toggle_btn' className='props-toggle-btn' onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}>
                <Icon icon={isCollapsed ? icons.chevronRight : icons.chevronLeft} size={14} />
            </button>
            <div className='cms-props-body scrollbar-admin'>{renderContent()}</div>
        </div>
    );
};

const SectionsTab = () => {
    const [subTab, setSubTab] = React.useState(localStorage.getItem('cms_props_subtab') || 'Page Section');
    const [activeSubNav, setActiveSubNav] = React.useState(() => {
        const savedSubTab = localStorage.getItem('cms_props_subtab') || 'Page Section';
        if (savedSubTab === 'Page Section') {
            return localStorage.getItem('cms_props_active_subnav') || null;
        }
        return null;
    });

    React.useEffect(() => {
        localStorage.setItem('cms_props_subtab', subTab);
        if (subTab !== 'Page Section') {
            setActiveSubNav(null);
        }
    }, [subTab]);

    React.useEffect(() => {
        if (activeSubNav) {
            localStorage.setItem('cms_props_active_subnav', activeSubNav);
        } else {
            localStorage.removeItem('cms_props_active_subnav');
        }
    }, [activeSubNav]);

    return (<div className='cms-props-tab-case'>
        <div className='cms-props-tab-head'>
            {activeSubNav ? (
                <button className='cms-props-back-btn' onClick={() => setActiveSubNav(null)}>
                    <Icon icon={icons.arrowLeft} /> Back
                </button>
            ) : (
                <>
                    <button className={`cms-props-tab-btn ${subTab === 'Page Section' ? 'active' : ''}`} onClick={() => setSubTab('Page Section')}>Page Section </button>
                    <button className={`cms-props-tab-btn ${subTab === 'Section Presets' ? 'active' : ''}`} onClick={() => setSubTab('Section Presets')}>Section Presets </button>
                </>
            )}
        </div>
        <div className='cms-props-tab-body scrollbar-admin'>
            {subTab === 'Page Section' ? <SectionNavigator activeSubNav={activeSubNav} setActiveSubNav={setActiveSubNav} /> : <TemplateGallery />}
        </div>
    </div>);

};

export default CmsProps;
