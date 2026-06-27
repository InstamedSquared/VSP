import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { useModal } from '../../context/ModalContext';
import SectionToolbar from './SectionToolbar';
import BlockToolbar from './BlockToolbar';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import DesignControls from './DesignControls';
import CmsBreadcrumbs from './CmsBreadcrumbs';

const CmsCanvasToolbar = () => {
    const { selectedElement, setSelectedElement, deleteBlock, moveBlock, removeSection, headerData, updateSectionSetting, updateNavigationProperty, removeNavigation } = useCMS();
    const { openPopup, closePopup } = useModal();

    const handleDelete = () => {
        if (!selectedElement || !selectedElement.type) return;

        if (selectedElement.type === 'section') {
            const section = selectedElement.data;
            openPopup({
                title: 'Delete Section',
                content: `Are you sure you want to delete "${section.section_name || section.template || 'this section'}"? This action cannot be undone.`,
                style: 'warning',
                isAlert: true,
                actions: [
                    { text: 'Cancel', onClick: closePopup, className: 'btn-outlined' },
                    { text: 'Delete', className: 'btn-danger', icon: icons.delete, onClick: () => { removeSection(section.id); setSelectedElement({ type: null }); closePopup(); } }
                ]
            });
        } else if (selectedElement.type === 'nav-link') {
            const nav = selectedElement.data;
            openPopup({
                title: 'Delete Link',
                content: `Are you sure you want to delete "${nav.label}"? This action cannot be undone.`,
                style: 'warning',
                isAlert: true,
                actions: [
                    { text: 'Cancel', onClick: closePopup, className: 'btn-outlined' },
                    { text: 'Delete', className: 'btn-danger', icon: icons.delete, onClick: () => { removeNavigation(nav.id); setSelectedElement({ type: null }); closePopup(); } }
                ]
            });
        } else if (selectedElement.sectionId !== undefined && selectedElement.id !== undefined) {
            deleteBlock(selectedElement.sectionId, selectedElement.id);
        }
    };

    const renderToolbar = () => {
        if (!selectedElement || !selectedElement.type) {
            return (
                <div className="cms-toolbar-empty">
                    <p>Select an element to edit properties</p>
                </div>
            );
        }

        switch (selectedElement.type) {
            case 'section':
                return <SectionToolbar data={selectedElement.data} />;
            case 'footer':
                return <SectionToolbar data={{ ...selectedElement.data, id: selectedElement.id }} />;
            case 'header':
                return <SectionToolbar data={{ ...selectedElement.data, id: selectedElement.id }} />;
            case 'nav':
                return (
                    <div className="section-toolbar">
                        <CmsBreadcrumbs />
                        <div className='toolbar-divider' />
                        <DesignControls 
                            data={selectedElement.data} 
                            updateProperty={(key, value) => {
                                updateSectionSetting('header', 'navSettings', (prevNavSettings) => ({
                                    ...(prevNavSettings || {}),
                                    [key]: value
                                }));
                                setSelectedElement(prev => ({
                                    ...prev,
                                    data: {
                                        ...prev.data,
                                        settings: {
                                            ...(prev.data?.settings || {}),
                                            [key]: value
                                        }
                                    }
                                }));
                            }} 
                            type="section" 
                        />
                    </div>
                );
            case 'nav-dropdown':
                return (
                    <div className="section-toolbar">
                        <CmsBreadcrumbs />
                        <div className='toolbar-divider' />
                        <DesignControls 
                            data={selectedElement.data} 
                            updateProperty={(key, value) => {
                                updateSectionSetting('header', 'dropdownSettings', (prev) => ({
                                    ...(prev || {}),
                                    [key]: value
                                }));
                                setSelectedElement(prev => ({
                                    ...prev,
                                    data: {
                                        ...prev.data,
                                        settings: {
                                            ...(prev.data?.settings || {}),
                                            [key]: value
                                        }
                                    }
                                }));
                            }} 
                            type="section" 
                        />
                    </div>
                );
            case 'nav-link':
                return <BlockToolbar data={selectedElement.data} type="nav-link" />;
            case 'logo':
                return (
                    <div className="section-toolbar">
                        <div className='toolbar-group'>
                            <div className="toolbar-label" style={{ padding: '0 10px', fontSize: '11px', fontWeight: 'bold', color: 'var(--cms-primary)' }}>Header Logo</div>
                        </div>
                        <div className='toolbar-divider' />
                        <DesignControls 
                            data={selectedElement.data} 
                            updateProperty={(key, value) => {
                                updateSectionSetting('header', 'logoSettings', (prevLogoSettings) => ({
                                    ...(prevLogoSettings || {}),
                                    [key]: value
                                }));
                                setSelectedElement(prev => ({
                                    ...prev,
                                    data: {
                                        ...prev.data,
                                        settings: {
                                            ...(prev.data?.settings || {}),
                                            [key]: value
                                        }
                                    }
                                }));
                            }} 
                            type="section" 
                        />
                    </div>
                );
            case 'text':
            case 'button':
            case 'image':
            case 'icon':
            case 'video':
            case 'richtext':
            case 'container':
                return <BlockToolbar data={selectedElement.data} type={selectedElement.type} />;
            default:
                return (<div className='cms-toolbar-empty'> <p>No properties for {selectedElement.type}</p> </div>);
        }
    };

    return (
        <div className='cms-canvas-toolbar'>
            <div className='cms-canvas-toolbar-tools'>{renderToolbar()}</div>
            {selectedElement && selectedElement.type && (
                <div className='cms-canvas-toolbar-actions'>
                    <div className='toolbar-divider' />
                    {selectedElement.type !== 'footer' && selectedElement.type !== 'header' && (
                        <>
                            <button className='toolbar-btn btn-danger' title='Delete Element' onClick={handleDelete}> <Icon icon={icons.delete} size={14} /> </button>
                            <div className='toolbar-divider' />
                        </>
                    )}
                    <button className='toolbar-btn' title='Close' onClick={() => setSelectedElement({ type: null })}> <Icon icon={icons.close} size={14} /> </button>
                </div>
            )}
        </div>
    );
};

export default CmsCanvasToolbar;
