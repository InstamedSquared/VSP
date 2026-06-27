import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { usePopupMenu } from '../../context/PopupMenuContext';
import { useCMS } from '../../context/CMSContext';
import { useNotifier } from '../../context/NotificationContext';


const CmsHeader = () => {
    const { user, logout, isDarkMode, isPremium, toggleDarkMode } = useAuth();
    const {
        pages,
        activePage,
        selectPage,
        publishPage,
        savePageDraft,
        pageData,
        view,
        setView,
        undo,
        redo,
        canUndo,
        canRedo,
        handleAddPage,
        confirmPublish,
        isDirty,
        hasUnpublishedChanges
    } = useCMS();
    const [isPublishing, setIsPublishing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [isPageMenuOpen, setIsPageMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { openPopupMenu, closePopupMenu } = usePopupMenu();
    const { notify } = useNotifier();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key.toLowerCase() === 'z') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        redo();
                    } else {
                        undo();
                    }
                } else if (e.key.toLowerCase() === 'y') {
                    e.preventDefault();
                    redo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const handlePublish = async () => {
        if (!activePage?.id) {
            console.error('No active page to publish');
            return false;
        }

        confirmPublish(activePage, async () => {
            setIsPublishing(true);
            try {
                const success = await publishPage();
                if (success) {
                    notify({ style: 'success', title: 'Published', message: 'Successfully Published!' });
                } else {
                    notify({ style: 'error', title: 'Error', message: 'Failed to publish page. Please try again.' });
                }
            } catch (error) {
                console.error('Publish error:', error);
                notify({ style: 'error', message: 'An error occurred while publishing.' });
            } finally {
                setIsPublishing(false);
            }
        });
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        const success = await savePageDraft();
        setIsSaving(false);
        if (success) {
            notify({ style: 'warning', title: 'Save to Draft', message: 'Draft saved successfully!' });
        } else {
            notify({ style: 'error', message: 'Failed to save draft.' });
        }
    };

    const RowActions = () => {
        useEffect(() => {
            setIsPageMenuOpen(true);
            return () => setIsPageMenuOpen(false);
        }, []);

        return (
            <div className='popup-menu-content'>
                {pages.filter(page => page.status === 'published').map(page => (
                    <button key={page.id} onClick={() => { selectPage(page); closePopupMenu(); }}>
                        <Icon icon={icons.file || icons.profile} />
                        <span>{page.title}</span>
                    </button>
                ))}
            </div>
        );

    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (<header className='cms-head'>
        <div className='cms-head-cell'>
            <h2 className='cms-header-title'>CMX</h2>
            <div className={`cms-head-status ${isDirty ? 'dirty' : ''}`}>
                <u></u>{activePage?.status === 'draft' || isDirty || hasUnpublishedChanges ? 'DRAFT' : 'PUBLISHED'}
            </div>
        </div>
        <div className='cms-head-cell'>
            <div className='cms-head-page-nav'>
                <Icon icon={icons.home} />
                <span className='cms-head-page-navbar' onClick={(e) => openPopupMenu({ referenceElement: e.currentTarget, content: <RowActions />, placement: 'bottom-start', })}><p>{activePage?.title || 'Home'}</p> <Icon icon={icons.chevronDown} className={isPageMenuOpen ? 'active' : ''} /> </span>
                <button title='Add Page' onClick={handleAddPage}><Icon icon={icons.add} /></button>
            </div>
            <div className='cms-head-cell-group'>
                <div style={{ display: 'flex', gap: '2px', marginRight: '5px', paddingRight: '5px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={undo} disabled={!canUndo} title='Undo (Ctrl+Z)'><Icon icon={icons.undo} /></button>
                    <button onClick={redo} disabled={!canRedo} title='Redo (Ctrl+Y)'><Icon icon={icons.redo} /></button>
                </div>
                <button className={`${view === 'laptop' ? 'active' : ''}`} onClick={() => setView('laptop')} title='Laptop View'> <Icon icon={icons.monitor} /> </button>
                <button className={`${view === 'tablet' ? 'active' : ''}`} onClick={() => setView('tablet')} title='Tablet View'> <Icon icon={icons.tablet} style={{ transform: 'rotate(90deg)' }} /> </button>
                <button className={`${view === 'mobile' ? 'active' : ''}`} onClick={() => setView('mobile')} title='Mobile View'> <Icon icon={icons.mobile} /> </button>
            </div>
        </div>
        <div className='cms-head-cell'>
            <button className='button save-draft-btn btn-warning' onClick={handleSaveDraft} disabled={!isDirty || isSaving}>
                <Icon icon={icons.archive} /> Draft {/* {isSaving ? 'Saving...' : 'Draft'}*/}
            </button>
            <button className='button' onClick={handlePublish} disabled={(activePage?.status === 'published' && !isDirty && !hasUnpublishedChanges) || isPublishing}>
                <Icon icon={icons.send} /> Publish {/* {isPublishing ? 'Publishing...' : 'Publish'}*/}
            </button>
            <div className={`user-profile ${showUserDropdown ? 'adm_header_open' : ''}`} ref={dropdownRef}>
                <button className='user-profile-btn' onClick={() => setShowUserDropdown(!showUserDropdown)}> <img src={user?.photoUrl || '/defaults/no-image.webp'} alt='User' /> </button>
                <div className='user-profile-chevron'> <Icon icon={icons.chevronUp} className={showUserDropdown ? '' : 'rotate-180'} /> </div>
                <div className='user-profile-info' style={{ display: showUserDropdown ? 'block' : 'none' }}>
                    <ul>
                        <li><NavLink to='/profile'><Icon icon={icons.profile} /><p>Profile</p></NavLink></li>
                        <li><NavLink to='/settings'><Icon icon={icons.settings} /><p>Settings</p></NavLink></li>
                        <li> <button onClick={toggleDarkMode}><Icon icon={isPremium ? icons.settingsAlt : (isDarkMode ? icons.view : icons.eyeSlash)} /> <p>{isPremium ? 'Premium' : (isDarkMode ? 'Dark' : 'Light')}</p> </button></li>
                        <div className='user-profile-dvr'></div>
                        <li><button onClick={logout} className='logout-btn'><Icon icon={icons.logout} /><p>Logout</p></button></li>
                    </ul>
                </div>
            </div>
        </div>
    </header>);
};

export default CmsHeader;
