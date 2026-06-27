import React, { useMemo } from 'react';
import { useCMS } from '../../context/CMSContext';
import { usePopupMenu } from '../../context/PopupMenuContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';

const NavigatorMenu = ({ breadcrumbs, selectedElement, setSelectedElement, closePopupMenu }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'section': return icons.layout;
            case 'container': return icons.layers;
            case 'text':
            case 'richtext': return icons.type;
            case 'button': return icons.mousePointer;
            case 'image': return icons.image;
            case 'icon': return icons.info;
            default: return icons.box;
        }
    };

    return (
        <div className='toolbar-popup'>
            <div className='popup-input-item' style={{ padding: '5px 10px' }}>
                <div className='input-label' style={{ fontSize: '10px', opacity: 0.6 }}>NAVIGATE UP</div>
            </div>
            {breadcrumbs.map((crumb) => {
                const isCurrent = crumb.id === selectedElement.id;
                return (
                    <button
                        key={`${crumb.type}-${crumb.id}`}
                        className={isCurrent ? 'active' : ''}
                        disabled={isCurrent}
                        onClick={() => {
                            if (isCurrent) return;
                            setSelectedElement({
                                type: crumb.type,
                                id: crumb.id,
                                sectionId: selectedElement.sectionId,
                                data: crumb.data
                            });
                            closePopupMenu();
                        }}
                    >
                        <Icon icon={getIcon(crumb.type)} size={14} />
                        <span style={{ textTransform: 'capitalize' }}>{crumb.name}</span>
                        {isCurrent && <Icon icon={icons.check} size={10} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                    </button>
                );
            })}
        </div>
    );
};

const CmsBreadcrumbs = () => {
    const { selectedElement, getElementByPath, setSelectedElement, pageData, headerData, footerData } = useCMS();
    const { openPopupMenu, closePopupMenu } = usePopupMenu();

    const breadcrumbs = useMemo(() => {
        if (!selectedElement || !selectedElement.id) return [];

        // Handle header/footer directly selected
        if (selectedElement.type === 'header' || selectedElement.type === 'footer') {
            const hfData = selectedElement.type === 'header' ? headerData : footerData;
            return [{
                id: selectedElement.type,
                name: hfData?.settings?.section_name || (selectedElement.type === 'header' ? 'Header' : 'Footer'),
                type: selectedElement.type,
                data: hfData
            }];
        }

        if (!selectedElement.sectionId) return [];

        // Handle header/footer blocks (blocks inside header/footer have sectionId 'header' or 'footer')
        if (selectedElement.sectionId === 'header' || selectedElement.sectionId === 'footer') {
            const hfData = selectedElement.sectionId === 'header' ? headerData : footerData;
            const crumbs = [];

            // Root (Header/Footer)
            crumbs.push({
                id: selectedElement.sectionId,
                name: hfData?.settings?.section_name || (selectedElement.sectionId === 'header' ? 'Header' : 'Footer'),
                type: selectedElement.sectionId,
                data: hfData
            });

            // Blocks
            if (selectedElement.type !== 'section' && selectedElement.type !== selectedElement.sectionId) {
                const pathParts = String(selectedElement.id).split('-');
                let currentPath = '';

                pathParts.forEach((part) => {
                    currentPath = currentPath === '' ? part : `${currentPath}-${part}`;
                    const element = getElementByPath(selectedElement.sectionId, currentPath);

                    if (element) {
                        crumbs.push({
                            id: currentPath,
                            name: element.name || element.tag || element.block_type || 'Block',
                            type: element.block_type,
                            data: element
                        });
                    }
                });
            }

            return crumbs;
        }

        const section = pageData.sections.find(s => s.id === selectedElement.sectionId);
        if (!section) return [];

        const crumbs = [];

        // Section
        crumbs.push({
            id: section.id,
            name: section.section_name || section.template || 'Section',
            type: 'section',
            data: section
        });

        // Blocks
        if (selectedElement.type !== 'section') {
            const pathParts = String(selectedElement.id).split('-');
            let currentPath = '';

            pathParts.forEach((part) => {
                currentPath = currentPath === '' ? part : `${currentPath}-${part}`;
                const element = getElementByPath(selectedElement.sectionId, currentPath);

                if (element) {
                    crumbs.push({
                        id: currentPath,
                        name: element.name || element.tag || element.block_type || 'Block',
                        type: element.block_type,
                        data: element
                    });
                }
            });
        }

        return crumbs;
    }, [selectedElement, getElementByPath, pageData.sections, headerData, footerData]);

    // Hide navigator when Section is active or no selection
    if (!selectedElement || selectedElement.type === 'section' || breadcrumbs.length === 0) return null;

    const handleOpenMenu = (e) => {
        openPopupMenu({
            referenceElement: e.currentTarget,
            content: (
                <NavigatorMenu
                    breadcrumbs={breadcrumbs}
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                    closePopupMenu={closePopupMenu}
                />
            ),
            placement: 'bottom-start'
        });
    };

    return (
        <div className='toolbar-group'>
            <button className='toolbar-btn' onClick={handleOpenMenu} title='Select Parent Container'>
                <Icon icon={icons.layers} size={14} />
                <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
            </button>
        </div>
    );
};

export default CmsBreadcrumbs;
