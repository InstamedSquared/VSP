import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useModal } from '../../context/ModalContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { FormToggle, FormSelect } from '../../components/common/FormFields';
import { usePopupMenu } from '../../context/PopupMenuContext';

const NavActionsMenu = ({ nav, onAdd, onDelete, onClose }) => (
    <div className='popup-menu-content'>
        <button onClick={(e) => { e.stopPropagation(); onClose(); onAdd(nav.id); }}>
            <Icon icon={icons.add} />Add Sub-link
        </button>
        <button className='danger' onClick={(e) => { e.stopPropagation(); onClose(); onDelete(nav); }}>
            <Icon icon={icons.delete} />Delete
        </button>
    </div>
);

const SectionNavigator = ({ activeSubNav, setActiveSubNav }) => {
    const { pageData, activePage, footerData, headerData, removeSection, setSelectedElement, selectedElement, navigations, updateSectionSetting, updateNavigationProperty, addNavigation, removeNavigation, reorderNavigations } = useCMS();
    const { openPopup, closePopup } = useModal();
    const { openPopupMenu, closePopupMenu } = usePopupMenu();

    const handleDeleteRequest = (section) => {
        openPopup({
            title: 'Delete Section',
            content: `Are you sure you want to delete "${section.section_name || section.template || 'this section'}"? This action cannot be undone.`,
            style: 'warning',
            isAlert: true,
            actions: [
                {
                    text: 'Cancel',
                    className: 'flat',
                    onClick: closePopup
                },
                {
                    text: 'Confirm Deletion',
                    className: 'red',
                    icon: icons.delete,
                    onClick: () => {
                        removeSection(section.id);
                        closePopup();
                    }
                }
            ]
        });
    };

    const handleDeleteNavigation = (nav) => {
        openPopup({
            title: 'Delete Link',
            content: `Are you sure you want to delete "${nav.label}"? This action cannot be undone.`,
            style: 'warning',
            isAlert: true,
            actions: [
                {
                    text: 'Cancel',
                    className: 'flat',
                    onClick: closePopup
                },
                {
                    text: 'Confirm Deletion',
                    className: 'red',
                    icon: icons.delete,
                    onClick: () => {
                        removeNavigation(nav.id);
                        closePopup();
                    }
                }
            ]
        });
    };

    const handleDragStart = (e, nav) => {
        e.dataTransfer.setData('text/plain', nav.id);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e) => {
        e.currentTarget.style.borderTop = '2px dashed #007bff';
    };

    const handleDragLeave = (e) => {
        e.currentTarget.style.borderTop = '';
    };

    const handleDrop = (e, targetNav, isSub) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.borderTop = '';
        
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId && draggedId !== String(targetNav.id)) {
            if (isSub) {
                reorderNavigations(draggedId, targetNav.id, true, targetNav.parent_id, 'after');
            } else {
                reorderNavigations(draggedId, targetNav.id, false, null, 'after');
            }
        }
    };

    if (activeSubNav === 'header') {
        return (
            <div className='cms-props-tab-body scrollbar-admin'>
                <div className='cms-props-list-case'>
                    <div className='cms-props-list-body cms-props-pagelet-panel'>
                        <div className='pagelet'><div className='cms-props-pagelet-body'>
                            <div className='cms-props-pagelet-head'><h3>DESKTOP HEADER</h3></div>
                            <div className='cms-props-header-logo'>
                                <div className='cms-props-header-logo-img'>
                                    <img src="/defaults/dashboard/dashboard.png" alt='logo' />
                                    <label htmlFor='header-upload'><Icon icon={icons.edit} /></label>
                                    <input type='file' id='header-upload' accept='image/*' style={{ display: 'none' }} />
                                </div>
                            </div>
                            <div className='cms-props-pagelet-row'>
                                <div className='cms-props-pagelet-title'><h4>Header Title Visibility</h4></div>
                                <ul className='radio-case cms-props-pagelet-radio'>
                                    <li><label><input type='checkbox' checked={headerData?.settings?.showTitle ?? true} onChange={(e) => updateSectionSetting('header', 'showTitle', e.target.checked)} />Title</label></li>
                                    <li><label><input type='checkbox' checked={headerData?.settings?.showSubtitle ?? true} onChange={(e) => updateSectionSetting('header', 'showSubtitle', e.target.checked)} />Subtitle</label></li>
                                </ul>
                            </div>
                            <div className='cms-props-pagelet-row'>
                                <div className='cms-props-pagelet-title'><h4>Dropdown Trigger</h4></div>
                                <ul className='radio-case cms-props-pagelet-radio'>
                                    <li><label><input type='radio' name='dropdownTrigger' value='hover' checked={(headerData?.settings?.dropdownTrigger || 'hover') === 'hover'} onChange={(e) => updateSectionSetting('header', 'dropdownTrigger', e.target.value)} />Hover</label></li>
                                    <li><label><input type='radio' name='dropdownTrigger' value='click' checked={headerData?.settings?.dropdownTrigger === 'click'} onChange={(e) => updateSectionSetting('header', 'dropdownTrigger', e.target.value)} />Click</label></li>
                                </ul>
                            </div>


                            <div className='cms-props-pagelet-column'>
                                <div className='cms-props-pagelet-title'><h4>Show Custom Buttons</h4></div>
                                <div className='toggle-switch small'><label><input type='checkbox' checked={headerData?.settings?.showCustomButtons ?? false} onChange={(e) => updateSectionSetting('header', 'showCustomButtons', e.target.checked)} /><span></span></label></div>
                            </div>
                            <div className='cms-props-pagelet-column'>
                                <div className='cms-props-pagelet-title'><h4>Home Page Link</h4></div>
                                <div className='toggle-switch small'><label><input type='checkbox' checked={headerData?.settings?.logoLinkToHome ?? false} onChange={(e) => updateSectionSetting('header', 'logoLinkToHome', e.target.checked)} /><span></span></label></div>
                            </div>
                        </div></div>
                        {/* Mobile Menu */}
                        <div className='pagelet'><div className='cms-props-pagelet-body'>
                            <div className='cms-props-pagelet-head'><h3>MOBILE MENU</h3></div>
                            <div className='cms-props-pagelet-row'>
                                <div className='cms-props-pagelet-title'><h4>Menu Style</h4></div>
                                <ul className='radio-case cms-props-pagelet-radio'>
                                    <li><label><input type='radio' name='mobileNavStyle' value='drawer' checked={(headerData?.settings?.navSettings?.mobileNavStyle || 'popup') === 'drawer'} onChange={(e) => updateSectionSetting('header', 'navSettings', { ...(headerData?.settings?.navSettings || {}), mobileNavStyle: e.target.value })} />Drawer</label></li>
                                    <li><label><input type='radio' name='mobileNavStyle' value='popup' checked={(headerData?.settings?.navSettings?.mobileNavStyle || 'popup') === 'popup'} onChange={(e) => updateSectionSetting('header', 'navSettings', { ...(headerData?.settings?.navSettings || {}), mobileNavStyle: e.target.value })} />Popup</label></li>
                                </ul>
                            </div>
                            <div className='cms-props-pagelet-row'>
                                <div className='cms-props-pagelet-title'><h4>Icon Style</h4></div>
                                <div className='wrap'><FormSelect name='iconStyle' options={[{ value: 'hamburger', label: 'Hamburger' }]} defaultValue='hamburger' /> </div>
                            </div>
                            <div className='cms-props-pagelet-column'>
                                <div className='cms-props-pagelet-title'><h4>Show Search</h4></div>
                                <div className='toggle-switch small'><label><input type='checkbox' /><span></span></label></div>
                            </div>
                        </div></div>

                        <div className='pagelet'>
                            <div className='cms-props-pagelet-body' style={{ gap: '5px' }}>
                                <div className='cms-props-pagelet-head' style={{ marginBottom: '3px' }}>
                                    <h3>HEADER LINKS</h3>
                                    <div className='cms-props-pagelet-head-btn'>
                                        <button onClick={() => addNavigation()} className='cms-props-open-btn' title='Add Link'><Icon icon={icons.addSimple} /></button>
                                    </div>
                                </div>
                                {navigations && navigations.length > 0 ? (
                                    navigations.filter(nav => !nav.parent_id).map((parentNav) => {
                                        const subLinks = navigations.filter(nav => nav.parent_id === parentNav.id);
                                        return (
                                            <React.Fragment key={parentNav.id}>
                                                <div className='cms-props-section cms-props-list-item'
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, parentNav)}
                                                    onDragEnd={handleDragEnd}
                                                    onDragOver={handleDragOver}
                                                    onDragEnter={handleDragEnter}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={(e) => handleDrop(e, parentNav, false)}
                                                >
                                                    <div className='item-info' style={{ cursor: 'grab' }}><p>{parentNav.label}</p></div>
                                                    <div className='item-actions'>
                                                        <button
                                                            className='cms-props-btnX cms-props-open-btn'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openPopupMenu({
                                                                    referenceElement: e.currentTarget,
                                                                    content: (
                                                                        <NavActionsMenu
                                                                            nav={parentNav}
                                                                            onAdd={addNavigation}
                                                                            onDelete={handleDeleteNavigation}
                                                                            onClose={closePopupMenu}
                                                                        />
                                                                    ),
                                                                    placement: 'bottom-end'
                                                                });
                                                            }}
                                                            title='More Options'
                                                        >
                                                            <Icon icon={icons.ellipsisV} size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {subLinks.map((subNav) => (
                                                    <div key={subNav.id} className='cms-props-section cms-props-list-item cms-props-list-item-sub'
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, subNav)}
                                                        onDragEnd={handleDragEnd}
                                                        onDragOver={handleDragOver}
                                                        onDragEnter={handleDragEnter}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={(e) => handleDrop(e, subNav, true)}
                                                    >
                                                        <div className='item-info' style={{ cursor: 'grab' }}><p>{subNav.label}</p></div>
                                                        <div className='item-actions'>
                                                            <button className='cms-props-open-btn cms-props-btn-delete' onClick={(e) => { e.stopPropagation(); handleDeleteNavigation(subNav); }} title='Delete Link'><Icon icon={icons.delete} size={14} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <div className='placeholder-text'>No navigations found.</div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </div >
        );
    }

    return (
        <div className='cms-props-list-case'>
            <div className='cms-props-list-body' onClick={() => setSelectedElement({ type: null, id: null, data: null })}>
                {/* Sticky site-wide scoped Header */}
                {!!(activePage?.has_header ?? pageData.has_header) && headerData && (
                    <div className={`cms-props-section cms-props-list-item header-item ${(selectedElement.id === 'header' && selectedElement.type === 'header') || selectedElement.sectionId === 'header' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedElement({ type: 'header', id: 'header', data: headerData }); }} /*onDoubleClick={(e) => { e.stopPropagation(); setActiveSubNav('header'); }}*/ >
                        <div className='item-info'><p>Header ({headerData.name || 'Default'})</p></div>
                        <div className='item-actions'>
                            {headerData.has_changes && <u className='cms-status-dirty'></u>}
                            <button className='cms-props-open-btn' onClick={(e) => { e.stopPropagation(); setActiveSubNav('header'); }}><Icon icon={icons.chevronRight} /></button>
                        </div>
                    </div>
                )}

                {/* Sticky site-wide scoped Footer */}
                {!!(activePage?.has_footer ?? pageData.has_footer) && footerData && (
                    <div className={`cms-props-section cms-props-list-item footer-item ${(selectedElement.id === 'footer' && selectedElement.type === 'footer') || selectedElement.sectionId === 'footer' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedElement({ type: 'footer', id: 'footer', data: footerData }); }} >
                        <div className='item-info'><p>Footer ({footerData.name || 'Default'})</p></div>
                        <div className='item-actions'>
                            {footerData.has_changes && <u className='cms-status-dirty'></u>}
                            <p className='item-actions-remark'>Permanent</p>
                        </div>
                    </div>
                )}

                {pageData.sections?.length > 0 ? (
                    pageData.sections.map((section, index) => (
                        <div
                            key={section.id}
                            className={`cms-props-section cms-props-list-item ${section.has_changes ? 'dirty' : ''} ${(selectedElement.id === section.id && selectedElement.type === 'section') || selectedElement.sectionId === section.id ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setSelectedElement({ type: 'section', id: section.id, data: section }); }}
                        >
                            <div className='item-info'><p>{section.section_name || section.template || 'Untitled Section'}</p></div>
                            <div className='item-actions'>{section.has_changes && <u className='cms-status-dirty'></u>} </div>
                        </div>
                    ))
                ) : (
                    <div className='placeholder-text'>No sections added yet.</div>
                )}
            </div>
        </div>
    );
};

export default SectionNavigator;
