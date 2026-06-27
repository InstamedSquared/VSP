import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/api';
import { useModal } from './ModalContext';
import { useAuth } from './AuthContext';
import { icons } from '../config/icons';
import { FormInput, FormSelect, FormTextarea, FormToggle } from '../components/common/FormFields';

const CMSContext = createContext();

export const useCMS = () => {
    const context = useContext(CMSContext);
    if (!context) {
        throw new Error('useCMS must be used within a CMSProvider');
    }
    return context;
};

export const CMSProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [pages, setPages] = useState([]);
    const [activePage, setActivePage] = useState(null);
    const { openPopup, closePopup, showAlert } = useModal();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState({ themes: [], sections: [], blocks: [] });
    const [selectedElementState, setSelectedElementState] = useState({ type: null, id: null, data: null });

    const [pageData, setPageData] = useState({
        id: null,
        title: '',
        sections: []
    });

    const [isDirty, setIsDirty] = useState(false);
    const [footerData, setFooterData] = useState(null);
    const [isFooterDirty, setIsFooterDirty] = useState(false);
    const [headerData, setHeaderData] = useState(null);
    const [isHeaderDirty, setIsHeaderDirty] = useState(false);

    const [navigations, setNavigations] = useState([]);

    const getElementByPath = useCallback((sectionId, path) => {
        if (!path && path !== 0) return null;
        
        if (sectionId === 'footer') {
            if (!footerData) return null;
            if (path === 'footer' || String(path) === 'footer') return footerData;

            const indices = String(path).split('-').map(Number);
            let currentArr = footerData.content;
            let target = null;

            for (let i = 0; i < indices.length; i++) {
                const idx = indices[i];
                if (!currentArr || !currentArr[idx]) return null;
                target = currentArr[idx];
                currentArr = target.blocks;
            }
            return target;
        }

        if (sectionId === 'header') {
            if (!headerData) return null;
            if (path === 'header' || String(path) === 'header') return headerData;

            const indices = String(path).split('-').map(Number);
            let currentArr = headerData.content;
            let target = null;

            for (let i = 0; i < indices.length; i++) {
                const idx = indices[i];
                if (!currentArr || !currentArr[idx]) return null;
                target = currentArr[idx];
                currentArr = target.blocks;
            }
            return target;
        }

        const section = pageData.sections.find(s => s.id === sectionId);
        if (!section) return null;

        if (path === sectionId || String(path) === String(sectionId)) return section;

        const indices = String(path).split('-').map(Number);
        let currentArr = section.blocks;
        let target = null;

        for (let i = 0; i < indices.length; i++) {
            const idx = indices[i];
            if (!currentArr || !currentArr[idx]) return null;
            target = currentArr[idx];
            currentArr = target.blocks;
        }

        return target;
    }, [pageData, footerData, headerData]);

    // Derive data dynamically from pageData / footerData / headerData to prevent stale state issues
    const selectedElement = {
        ...selectedElementState,
        data: (selectedElementState.id && !['nav-link', 'nav-dropdown'].includes(selectedElementState.type))
            ? (getElementByPath(selectedElementState.sectionId, selectedElementState.id) || selectedElementState.data)
            : selectedElementState.data
    };

    // Refs to store the latest context states and view settings to prevent stale closures in global toolbar popups
    const pageDataRef = useRef(pageData);
    pageDataRef.current = pageData;

    const footerDataRef = useRef(footerData);
    footerDataRef.current = footerData;

    const headerDataRef = useRef(headerData);
    headerDataRef.current = headerData;

    const selectedElementRef = useRef(selectedElement);
    selectedElementRef.current = selectedElement;

    const setSelectedElement = setSelectedElementState;
    const [activeStyleState, setActiveStyleState] = useState('normal'); // 'normal', 'hover', 'active', 'focus'
    const activeStyleStateRef = useRef(activeStyleState);
    activeStyleStateRef.current = activeStyleState;

    useEffect(() => {
        setActiveStyleState('normal');
    }, [selectedElementState.id, selectedElementState.sectionId]);

    const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
    const [history, setHistory] = useState([]);
    const [future, setFuture] = useState([]);

    const lastSaveTime = useRef(0);

    const saveHistory = useCallback(() => {
        const now = Date.now();
        if (now - lastSaveTime.current < 500) {
            lastSaveTime.current = now;
            return;
        }
        lastSaveTime.current = now;

        setIsDirty(true);
        setHistory(prev => {
            const currentState = {
                pageData: JSON.parse(JSON.stringify(pageData)),
                headerData: headerData ? JSON.parse(JSON.stringify(headerData)) : null,
                footerData: footerData ? JSON.parse(JSON.stringify(footerData)) : null,
                navigations: navigations ? JSON.parse(JSON.stringify(navigations)) : []
            };
            const newHistory = [...prev, currentState];
            if (newHistory.length > 50) newHistory.shift();
            return newHistory;
        });
        setFuture([]);
    }, [pageData, headerData, footerData, navigations]);

    const undo = useCallback(() => {
        if (history.length === 0) return;

        setFuture(prev => [{
            pageData: JSON.parse(JSON.stringify(pageData)),
            headerData: headerData ? JSON.parse(JSON.stringify(headerData)) : null,
            footerData: footerData ? JSON.parse(JSON.stringify(footerData)) : null,
            navigations: navigations ? JSON.parse(JSON.stringify(navigations)) : []
        }, ...prev]);

        const prevState = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));

        setPageData(prevState.pageData);
        if (prevState.headerData !== undefined) setHeaderData(prevState.headerData);
        if (prevState.footerData !== undefined) setFooterData(prevState.footerData);
        if (prevState.navigations !== undefined) setNavigations(prevState.navigations);
        
        setSelectedElementState({ type: null, id: null, data: null });
        setIsDirty(history.length - 1 > 0);
    }, [history, pageData, headerData, footerData, navigations]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        setHistory(prev => [...prev, {
            pageData: JSON.parse(JSON.stringify(pageData)),
            headerData: headerData ? JSON.parse(JSON.stringify(headerData)) : null,
            footerData: footerData ? JSON.parse(JSON.stringify(footerData)) : null,
            navigations: navigations ? JSON.parse(JSON.stringify(navigations)) : []
        }]);

        const nextState = future[0];
        setFuture(prev => prev.slice(1));

        setPageData(nextState.pageData);
        if (nextState.headerData !== undefined) setHeaderData(nextState.headerData);
        if (nextState.footerData !== undefined) setFooterData(nextState.footerData);
        if (nextState.navigations !== undefined) setNavigations(nextState.navigations);
        
        setSelectedElementState({ type: null, id: null, data: null });
        setIsDirty(true);
    }, [future, pageData, headerData, footerData, navigations]);

    const [view, setView] = useState(localStorage.getItem('cms_view') || 'laptop');

    const viewRef = useRef(view);
    viewRef.current = view;

    const fetchPages = useCallback(async () => {
        try {
            const response = await api.get('/api/cms/pages');
            if (response.data.success) {
                setPages(response.data.data);
                if (!activePage && response.data.data.length > 0) {
                    const savedPageId = localStorage.getItem('cms_active_page_id');
                    const savedPage = savedPageId ? response.data.data.find(p => String(p.id) === savedPageId) : null;
                    const home = savedPage || response.data.data.find(p => p.slug === 'home') || response.data.data[0];
                    setActivePage(home);
                }
            }
        } catch (error) {
            console.error('Failed to fetch CMS pages:', error);
        } finally {
            setLoading(false);
        }
    }, [activePage]);

    const fetchPageData = useCallback(async (pageId) => {
        if (!pageId) return;
        try {
            const response = await api.get(`/api/cms/pages/${pageId}`);
            if (response.data.success) {
                setPageData(response.data.data);
                setIsDirty(false);
                setHasUnpublishedChanges(false);
                setHistory([]);
                setFuture([]);
            }
        } catch (error) {
            console.error('Failed to fetch page data:', error);
        }
    }, []);

    const fetchTemplates = useCallback(async () => {
        try {
            const response = await api.get('/api/cms/templates');
            if (response.data.success) {
                setTemplates(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        }
    }, []);

    const fetchNavigations = useCallback(async () => {
        try {
            const response = await api.get('/api/cms/navigations');
            if (response.data.success) {
                setNavigations(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch navigations:', error);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPages();
            fetchTemplates();
            fetchNavigations();
        }
    }, [isAuthenticated, fetchPages, fetchTemplates, fetchNavigations]);

    const fetchFooterData = useCallback(async (projectId = null) => {
        try {
            const response = await api.get('/api/cms/footers', { params: { id_project: projectId } });
            if (response.data.success) {
                setFooterData(response.data.data);
                setIsFooterDirty(false);
            }
        } catch (error) {
            console.error('Failed to fetch footer data:', error);
        }
    }, []);

    const fetchHeaderData = useCallback(async (projectId = null) => {
        try {
            const response = await api.get('/api/cms/headers', { params: { id_project: projectId } });
            if (response.data.success) {
                setHeaderData(response.data.data);
                setIsHeaderDirty(false);
            }
        } catch (error) {
            console.error('Failed to fetch header data:', error);
        }
    }, []);

    useEffect(() => {
        if (activePage?.id) {
            fetchPageData(activePage.id);
            fetchFooterData(activePage.id_project);
            fetchHeaderData(activePage.id_project);
            localStorage.setItem('cms_active_page_id', String(activePage.id));
        }
    }, [activePage, fetchPageData, fetchFooterData, fetchHeaderData]);

    useEffect(() => {
        localStorage.setItem('cms_view', view);
    }, [view]);

    const selectPage = (page) => {
        setActivePage(page);
    };

    const savePageDraft = useCallback(async (updatedData = pageData) => {
        if (!updatedData.id) return false;
        try {
            // Save page sections
            for (const section of updatedData.sections) {
                await api.put(`/api/cms/sections/${section.id}`, {
                    blocks: section.blocks,
                    settings: section.settings,
                    section_name: section.section_name
                });
            }
            // Save footer draft if dirty
            if (isFooterDirty && footerData) {
                await api.put('/api/cms/footers', {
                    id: footerData.id,
                    name: footerData.name,
                    blocks: footerData.content,
                    settings: footerData.settings
                });
                setIsFooterDirty(false);
            }
            // Save header draft if dirty
            if (isHeaderDirty && headerData) {
                await api.put('/api/cms/headers', {
                    id: headerData.id,
                    name: headerData.name,
                    blocks: headerData.content,
                    settings: headerData.settings
                });
                setIsHeaderDirty(false);
            }
            
            // Save navigations
            if (navigations) {
                await api.put('/api/cms/navigations', { navigations });
            }
            setIsDirty(false);
            setHasUnpublishedChanges(true);
            setHistory([]);
            setFuture([]);
            return true;
        } catch (error) {
            console.error('Failed to save draft:', error);
            return false;
        }
    }, [pageData, isFooterDirty, footerData, isHeaderDirty, headerData, navigations]);

    const publishPage = async () => {
        if (!activePage?.id) {
            console.error('No active page to publish');
            return false;
        }
        try {
            // Save footer draft if dirty
            if (footerData && isFooterDirty) {
                await api.put('/api/cms/footers', {
                    id: footerData.id,
                    name: footerData.name,
                    blocks: footerData.content,
                    settings: footerData.settings
                });
            }

            // Save header draft if dirty
            if (headerData && isHeaderDirty) {
                await api.put('/api/cms/headers', {
                    id: headerData.id,
                    name: headerData.name,
                    blocks: headerData.content,
                    settings: headerData.settings
                });
            }

            // Save navigations
            if (navigations) {
                await api.put('/api/cms/navigations', { navigations });
            }

            const response = await api.post(`/api/cms/pages/${activePage.id}/publish`, {
                sections: pageData.sections
            });
            
            // Publish footer if loaded
            if (footerData) {
                await api.post(`/api/cms/footers/${footerData.id}/publish`);
                setIsFooterDirty(false);
            }

            // Publish header if loaded
            if (headerData) {
                await api.post(`/api/cms/headers/${headerData.id}/publish`);
                setIsHeaderDirty(false);
            }

            console.log('Publish API Response:', response.data);
            if (response.data.success) {
                await fetchPageData(activePage.id);
                await fetchFooterData(activePage.id_project);
                await fetchHeaderData(activePage.id_project);
                setHasUnpublishedChanges(false);
                return true;
            }
        } catch (error) {
            console.error('Failed to publish page:', error);
        }
        return false;
    };

    const updateSection = (id, updates) => {
        saveHistory();
        setPageData(prev => {
            const newSections = prev.sections.map(section =>
                section.id === id ? { ...section, ...updates } : section
            );
            return { ...prev, sections: newSections };
        });
    };

    const updateSectionSetting = (sectionId, key, value) => {
        saveHistory();

        let finalKey = key;
        const currentActiveStyleState = activeStyleStateRef.current;
        if (currentActiveStyleState !== 'normal' && !['layout', 'innerClass', 'navSettings', 'logoSettings'].includes(key)) {
            const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
            finalKey = `${currentActiveStyleState}${capitalized}`;
        }

        if (sectionId === 'footer') {
            setFooterData(prev => {
                const settings = { ...prev.settings };
                const isGlobalKey = ['hideDesktop', 'hideTablet', 'hideMobile'].includes(key);

                if (viewRef.current === 'mobile' && !isGlobalKey) {
                    if (!settings.responsive) settings.responsive = {};
                    if (!settings.responsive.mobile) settings.responsive.mobile = {};
                    settings.responsive.mobile[finalKey] = typeof value === 'function' ? value(settings.responsive.mobile[finalKey]) : value;
                } else if (viewRef.current === 'tablet' && !isGlobalKey) {
                    if (!settings.responsive) settings.responsive = {};
                    if (!settings.responsive.tablet) settings.responsive.tablet = {};
                    settings.responsive.tablet[finalKey] = typeof value === 'function' ? value(settings.responsive.tablet[finalKey]) : value;
                } else {
                    settings[finalKey] = typeof value === 'function' ? value(settings[finalKey]) : value;
                }

                const updatedFooter = { ...prev, settings, has_changes: true };
                setIsFooterDirty(true);
                setHasUnpublishedChanges(true);
                if (selectedElementRef.current.type === 'footer') {
                    setSelectedElement(prevSelected => ({ ...prevSelected, data: updatedFooter }));
                }
                return updatedFooter;
            });
            return;
        }

        if (sectionId === 'header') {
            setHeaderData(prev => {
                const settings = { ...prev.settings };
                const isGlobalKey = ['hideDesktop', 'hideTablet', 'hideMobile'].includes(key);

                if (viewRef.current === 'mobile' && !isGlobalKey) {
                    if (!settings.responsive) settings.responsive = {};
                    if (!settings.responsive.mobile) settings.responsive.mobile = {};
                    settings.responsive.mobile[finalKey] = typeof value === 'function' ? value(settings.responsive.mobile[finalKey]) : value;
                } else if (viewRef.current === 'tablet' && !isGlobalKey) {
                    if (!settings.responsive) settings.responsive = {};
                    if (!settings.responsive.tablet) settings.responsive.tablet = {};
                    settings.responsive.tablet[finalKey] = typeof value === 'function' ? value(settings.responsive.tablet[finalKey]) : value;
                } else {
                    settings[finalKey] = typeof value === 'function' ? value(settings[finalKey]) : value;
                }

                const updatedHeader = { ...prev, settings, has_changes: true };
                setIsHeaderDirty(true);
                setHasUnpublishedChanges(true);
                if (selectedElementRef.current.type === 'header') {
                    setSelectedElement(prevSelected => ({ ...prevSelected, data: updatedHeader }));
                } else if (selectedElementRef.current.type === 'logo' && finalKey === 'logoSettings') {
                    setSelectedElement(prevSelected => ({ ...prevSelected, data: { settings: updatedHeader.settings.logoSettings } }));
                } else if (selectedElementRef.current.type === 'nav' && finalKey === 'navSettings') {
                    setSelectedElement(prevSelected => ({ ...prevSelected, data: { settings: updatedHeader.settings.navSettings } }));
                }
                return updatedHeader;
            });
            return;
        }

        setPageData(prev => {
            const newSections = prev.sections.map(section => {
                if (section.id !== sectionId) return section;

                const settings = { ...section.settings };
                const isGlobalKey = ['hideDesktop', 'hideTablet', 'hideMobile'].includes(key);

                if (viewRef.current === 'mobile' && !isGlobalKey) {
                    if (!settings.responsive) settings.responsive = {};
                    if (!settings.responsive.mobile) settings.responsive.mobile = {};
                    settings.responsive.mobile[finalKey] = typeof value === 'function' ? value(settings.responsive.mobile[finalKey]) : value;
                } else if (viewRef.current === 'tablet' && !isGlobalKey) {
                    if (!settings.responsive) settings.responsive = {};
                    if (!settings.responsive.tablet) settings.responsive.tablet = {};
                    settings.responsive.tablet[finalKey] = typeof value === 'function' ? value(settings.responsive.tablet[finalKey]) : value;
                } else {
                    settings[finalKey] = typeof value === 'function' ? value(settings[finalKey]) : value;
                }

                const updatedSection = { ...section, settings, has_changes: true };

                // If this section is currently selected, update the selection state too
                if (selectedElementRef.current.id === sectionId && selectedElementRef.current.type === 'section') {
                    setSelectedElement(prev => ({ ...prev, data: updatedSection }));
                }

                return updatedSection;
            });
            return { ...prev, sections: newSections };
        });
    };

    const updateNestedBlocks = (blocks, path, action) => {
        const indices = String(path).split('-').map(Number);
        const newBlocks = [...blocks];

        let currentArr = newBlocks;

        for (let i = 0; i < indices.length - 1; i++) {
            const idx = indices[i];
            currentArr[idx] = { ...currentArr[idx], blocks: [...(currentArr[idx].blocks || [])] };
            currentArr = currentArr[idx].blocks;
        }

        const lastIdx = indices[indices.length - 1];
        const result = action(currentArr, lastIdx);

        return { blocks: newBlocks, updatedItem: result };
    };

    const updateNavigationProperty = (navId, key, value) => {
        saveHistory();
        
        let finalKey = key;
        const structuralKeys = ['tag', 'href', 'target', 'title', 'aria-label', 'className', 'src', 'hideDesktop', 'hideTablet', 'hideMobile'];
        const currentActiveStyleState = activeStyleStateRef.current;
        if (currentActiveStyleState !== 'normal' && !structuralKeys.includes(key)) {
            finalKey = `${currentActiveStyleState}-${key}`;
        }

        setNavigations(prev => {
            return prev.map(nav => {
                if (String(nav.id) === String(navId)) {
                    const updatedNav = { ...nav, has_changes: true };
                    
                    if (['label', 'url', 'parent_id'].includes(key)) {
                        updatedNav[key] = value;
                    } else if (key === 'href') {
                        updatedNav['url'] = value;
                    } else {
                        const settings = { ...(nav.settings || {}) };
                        settings[finalKey] = value;
                        updatedNav.settings = settings;
                    }
                    
                    if (selectedElementRef.current.id === navId) {
                        setSelectedElement(prevSelected => ({
                            ...prevSelected,
                            data: { ...updatedNav, properties: updatedNav.settings }
                        }));
                    }
                    return updatedNav;
                }
                return nav;
            });
        });
        setHasUnpublishedChanges(true);
    };

    const addNavigation = (parentId = null) => {
        saveHistory();
        const newNav = {
            id: 'new_' + Date.now() + Math.floor(Math.random() * 1000),
            label: 'New Link',
            url: '#',
            parent_id: parentId,
            settings: {}
        };
        setNavigations(prev => [...prev, newNav]);
        setHasUnpublishedChanges(true);
    };

    const removeNavigation = (id) => {
        saveHistory();
        setNavigations(prev => prev.filter(nav => String(nav.id) !== String(id) && String(nav.parent_id) !== String(id)));
        if (String(selectedElementRef.current.id) === String(id)) {
            setSelectedElement({ type: null, id: null, data: null });
        }
        setHasUnpublishedChanges(true);
    };

    const reorderNavigations = (draggedId, targetId, isTargetSubLink, targetParentId, position = 'after') => {
        saveHistory();
        setNavigations(prev => {
            const list = [...prev];
            const draggedIndex = list.findIndex(nav => String(nav.id) === String(draggedId));
            if (draggedIndex === -1) return prev;
            
            const draggedItem = { ...list[draggedIndex], has_changes: true };
            list.splice(draggedIndex, 1);
            
            const targetIndex = list.findIndex(nav => String(nav.id) === String(targetId));
            
            if (isTargetSubLink) {
                draggedItem.parent_id = targetParentId;
            } else {
                draggedItem.parent_id = null;
            }
            
            if (targetIndex !== -1) {
                if (position === 'before') {
                    list.splice(targetIndex, 0, draggedItem);
                } else {
                    list.splice(targetIndex + 1, 0, draggedItem);
                }
            } else {
                list.push(draggedItem);
            }
            
            return list;
        });
        setHasUnpublishedChanges(true);
    };

    const updateBlockProperty = (sectionId, blockPath, key, value) => {
        saveHistory();
        
        let finalKey = key;
        const structuralKeys = ['tag', 'href', 'target', 'title', 'aria-label', 'className', 'src', 'hideDesktop', 'hideTablet', 'hideMobile'];
        const currentActiveStyleState = activeStyleStateRef.current;
        if (currentActiveStyleState !== 'normal' && !structuralKeys.includes(key)) {
            finalKey = `${currentActiveStyleState}-${key}`;
        }

        if (sectionId === 'footer') {
            setFooterData(prev => {
                const { blocks: newBlocks, updatedItem: block } = updateNestedBlocks(prev.content, blockPath, (arr, idx) => {
                    const block = { ...arr[idx] };
                    if (key === 'tag') {
                        block.tag = value;
                    } else {
                        block.properties = { ...block.properties, [finalKey]: value };
                    }
                    arr[idx] = block;
                    return block;
                });
                setIsFooterDirty(true);
                setHasUnpublishedChanges(true);
                if (selectedElementRef.current.id === blockPath) {
                    setSelectedElement(prevSelected => ({ ...prevSelected, data: block }));
                }
                return { ...prev, content: newBlocks, has_changes: true };
            });
            return;
        }

        if (sectionId === 'header') {
            setHeaderData(prev => {
                const { blocks: newBlocks, updatedItem: block } = updateNestedBlocks(prev.content, blockPath, (arr, idx) => {
                    const block = { ...arr[idx] };
                    if (key === 'tag') {
                        block.tag = value;
                    } else {
                        block.properties = { ...block.properties, [finalKey]: value };
                    }
                    arr[idx] = block;
                    return block;
                });
                setIsHeaderDirty(true);
                setHasUnpublishedChanges(true);
                if (selectedElementRef.current.id === blockPath) {
                    setSelectedElement(prevSelected => ({ ...prevSelected, data: block }));
                }
                return { ...prev, content: newBlocks, has_changes: true };
            });
            return;
        }

        setPageData(prev => {
            const section = prev.sections.find(s => s.id === sectionId);
            if (!section) return prev;

            const { blocks: newBlocks, updatedItem: block } = updateNestedBlocks(section.blocks, blockPath, (arr, idx) => {
                const block = { ...arr[idx] };

                if (key === 'tag') {
                    block.tag = value;
                    if (block.responsive?.mobile?.properties?.tag) {
                        delete block.responsive.mobile.properties.tag;
                    }
                    if (block.responsive?.tablet?.properties?.tag) {
                        delete block.responsive.tablet.properties.tag;
                    }
                } else if (['hideDesktop', 'hideTablet', 'hideMobile'].includes(key)) {
                    block.properties = { ...block.properties, [finalKey]: value };
                } else if (viewRef.current === 'mobile') {
                    if (!block.responsive) block.responsive = {};
                    if (!block.responsive.mobile) block.responsive.mobile = {};
                    if (!block.responsive.mobile.properties) block.responsive.mobile.properties = {};
                    block.responsive.mobile.properties[finalKey] = value;
                } else if (viewRef.current === 'tablet') {
                    if (!block.responsive) block.responsive = {};
                    if (!block.responsive.tablet) block.responsive.tablet = {};
                    if (!block.responsive.tablet.properties) block.responsive.tablet.properties = {};
                    block.responsive.tablet.properties[finalKey] = value;
                } else {
                    const properties = { ...block.properties, [finalKey]: value };
                    block.properties = properties;
                }

                arr[idx] = block;
                return block;
            });

            if (selectedElementRef.current.sectionId === sectionId && selectedElementRef.current.id === blockPath) {
                setSelectedElement(prevSelected => ({
                    ...prevSelected,
                    data: block
                }));
            }

            const newSections = prev.sections.map(s =>
                s.id === sectionId ? { ...s, blocks: newBlocks, has_changes: true } : s
            );
            return { ...prev, sections: newSections };
        });
    };


    const updateBlockContent = (sectionId, blockPath, content) => {
        saveHistory();
        if (sectionId === 'footer') {
            setFooterData(prev => {
                const { blocks: newBlocks, updatedItem: block } = updateNestedBlocks(prev.content, blockPath, (arr, idx) => {
                    const block = { ...arr[idx], content };
                    arr[idx] = block;
                    return block;
                });
                setIsFooterDirty(true);
                setHasUnpublishedChanges(true);
                if (selectedElement.id === blockPath) {
                    setSelectedElement(prevSelected => ({ ...prevSelected, data: block }));
                }
                return { ...prev, content: newBlocks, has_changes: true };
            });
            return;
        }

        if (sectionId === 'header') {
            setHeaderData(prev => {
                const { blocks: newBlocks, updatedItem: block } = updateNestedBlocks(prev.content, blockPath, (arr, idx) => {
                    const block = { ...arr[idx], content };
                    arr[idx] = block;
                    return block;
                });
                setIsHeaderDirty(true);
                setHasUnpublishedChanges(true);
                if (selectedElement.id === blockPath) {
                    setSelectedElement(prevSelected => ({ ...prevSelected, data: block }));
                }
                return { ...prev, content: newBlocks, has_changes: true };
            });
            return;
        }

        setPageData(prev => {
            const newSections = prev.sections.map(section => {
                if (section.id !== sectionId) return section;

                const { blocks: newBlocks, updatedItem: block } = updateNestedBlocks(section.blocks, blockPath, (arr, idx) => {
                    const block = { ...arr[idx], content };
                    arr[idx] = block;
                    return block;
                });

                if (selectedElement.sectionId === sectionId && selectedElement.id === blockPath) {
                    setSelectedElement(prevSelected => ({
                        ...prevSelected,
                        data: block
                    }));
                }

                return { ...section, blocks: newBlocks, has_changes: true };
            });
            return { ...prev, sections: newSections };
        });
    };

    const addBlock = (blockTemplate) => {
        saveHistory();
        let sectionId = null;
        let containerPath = null;

        if (selectedElementRef.current.type === 'section') {
            sectionId = selectedElementRef.current.id;
        } else if (selectedElementRef.current.sectionId) {
            sectionId = selectedElementRef.current.sectionId;
            if (selectedElementRef.current.type === 'container') {
                containerPath = selectedElementRef.current.id;
            }
        } else if (selectedElementRef.current.type === 'footer') {
            sectionId = 'footer';
            if (selectedElementRef.current.id !== 'footer') {
                containerPath = selectedElementRef.current.id;
            }
        } else if (selectedElementRef.current.type === 'header') {
            sectionId = 'header';
            if (selectedElementRef.current.id !== 'header') {
                containerPath = selectedElementRef.current.id;
            }
        }

        if (sectionId === 'footer') {
            setFooterData(prev => {
                let newBlocks = [...(prev.content || [])];
                if (containerPath !== null) {
                    const { blocks: res } = updateNestedBlocks(prev.content, containerPath, (arr, idx) => {
                        const container = { ...arr[idx] };
                        container.blocks = [...(container.blocks || []), { ...blockTemplate }];
                        arr[idx] = container;
                        return container;
                    });
                    newBlocks = res;
                } else {
                    newBlocks.push({ ...blockTemplate });
                }
                setIsFooterDirty(true);
                setHasUnpublishedChanges(true);
                return { ...prev, content: newBlocks, has_changes: true };
            });
            return;
        }

        if (sectionId === 'header') {
            setHeaderData(prev => {
                let newBlocks = [...(prev.content || [])];
                if (containerPath !== null) {
                    const { blocks: res } = updateNestedBlocks(prev.content, containerPath, (arr, idx) => {
                        const container = { ...arr[idx] };
                        container.blocks = [...(container.blocks || []), { ...blockTemplate }];
                        arr[idx] = container;
                        return container;
                    });
                    newBlocks = res;
                } else {
                    newBlocks.push({ ...blockTemplate });
                }
                setIsHeaderDirty(true);
                setHasUnpublishedChanges(true);
                return { ...prev, content: newBlocks, has_changes: true };
            });
            return;
        }

        if (!sectionId) {
            if (pageDataRef.current.sections.length > 0) {
                sectionId = pageDataRef.current.sections[pageDataRef.current.sections.length - 1].id;
            } else {
                return;
            }
        }

        setPageData(prev => {
            const newSections = prev.sections.map(section => {
                if (section.id !== sectionId) return section;

                if (containerPath !== null) {
                    const { blocks: newBlocks } = updateNestedBlocks(section.blocks, containerPath, (arr, idx) => {
                        const container = { ...arr[idx] };
                        container.blocks = [...(container.blocks || []), { ...blockTemplate }];
                        arr[idx] = container;
                        return container;
                    });
                    return { ...section, blocks: newBlocks, has_changes: true };
                }

                return {
                    ...section,
                    blocks: [...(section.blocks || []), { ...blockTemplate }],
                    has_changes: true
                };
            });
            return { ...prev, sections: newSections };
        });
    };

    const deleteBlock = (sectionId, blockPath) => {
        saveHistory();
        if (sectionId === 'footer') {
            setFooterData(prev => {
                const { blocks: newBlocks } = updateNestedBlocks(prev.content, blockPath, (arr, idx) => {
                    arr.splice(idx, 1);
                });
                setIsFooterDirty(true);
                setHasUnpublishedChanges(true);
                return { ...prev, content: newBlocks, has_changes: true };
            });
            setSelectedElement({ type: null, id: null, data: null });
            return;
        }

        if (sectionId === 'header') {
            setHeaderData(prev => {
                const { blocks: newBlocks } = updateNestedBlocks(prev.content, blockPath, (arr, idx) => {
                    arr.splice(idx, 1);
                });
                setIsHeaderDirty(true);
                setHasUnpublishedChanges(true);
                return { ...prev, content: newBlocks, has_changes: true };
            });
            setSelectedElement({ type: null, id: null, data: null });
            return;
        }

        setPageData(prev => {
            const newSections = prev.sections.map(section => {
                if (section.id !== sectionId) return section;

                const { blocks: newBlocks } = updateNestedBlocks(section.blocks, blockPath, (arr, idx) => {
                    arr.splice(idx, 1);
                });

                return { ...section, blocks: newBlocks, has_changes: true };
            });
            return { ...prev, sections: newSections };
        });
        setSelectedElement({ type: null, id: null, data: null });
    };

    const addColumnToRow = (sectionId, rowBlockPath) => {
        saveHistory();
        const newColTemplate = { block_type: 'container', properties: { className: 'cms-col' }, blocks: [] };

        if (sectionId === 'footer') {
            setFooterData(prev => {
                const { blocks: newBlocks } = updateNestedBlocks(prev.content, rowBlockPath, (arr, idx) => {
                    const container = { ...arr[idx] };
                    container.blocks = [...(container.blocks || []), { ...newColTemplate }];
                    arr[idx] = container;
                });
                setIsFooterDirty(true);
                setHasUnpublishedChanges(true);
                return { ...prev, content: newBlocks, has_changes: true };
            });
            return;
        }

        if (sectionId === 'header') {
            setHeaderData(prev => {
                const { blocks: newBlocks } = updateNestedBlocks(prev.content, rowBlockPath, (arr, idx) => {
                    const container = { ...arr[idx] };
                    container.blocks = [...(container.blocks || []), { ...newColTemplate }];
                    arr[idx] = container;
                });
                setIsHeaderDirty(true);
                setHasUnpublishedChanges(true);
                return { ...prev, content: newBlocks, has_changes: true };
            });
            return;
        }

        setPageData(prev => {
            const newSections = prev.sections.map(section => {
                if (section.id !== sectionId) return section;

                const { blocks: newBlocks } = updateNestedBlocks(section.blocks, rowBlockPath, (arr, idx) => {
                    const container = { ...arr[idx] };
                    container.blocks = [...(container.blocks || []), { ...newColTemplate }];
                    arr[idx] = container;
                });

                return { ...section, blocks: newBlocks, has_changes: true };
            });
            return { ...prev, sections: newSections };
        });
    };

    const removeColumnFromRow = (sectionId, colBlockPath) => {
        // Extract the parent row path and the column index from the column's block path
        const indices = String(colBlockPath).split('-').map(Number);
        if (indices.length < 2) return false;

        const parentPath = indices.slice(0, -1).join('-');

        // Check if parent has more than 1 column (minimum guard)
        const section = sectionId === 'footer' ? footerDataRef.current :
                        sectionId === 'header' ? headerDataRef.current :
                        pageDataRef.current.sections.find(s => s.id === sectionId);
        if (!section) return false;

        const sourceBlocks = sectionId === 'footer' || sectionId === 'header' ?
            section.content : section.blocks;

        const parentBlock = (function findBlock(blocks, path) {
            const pIndices = String(path).split('-').map(Number);
            let current = blocks;
            for (let i = 0; i < pIndices.length; i++) {
                if (!current || !current[pIndices[i]]) return null;
                if (i === pIndices.length - 1) return current[pIndices[i]];
                current = current[pIndices[i]].blocks;
            }
            return null;
        })(sourceBlocks, parentPath);

        const childCount = parentBlock?.blocks?.length || 0;
        if (childCount <= 1) return false;

        // Proceed with removal
        saveHistory();

        if (sectionId === 'footer') {
            setFooterData(prev => {
                const { blocks: newBlocks } = updateNestedBlocks(prev.content, colBlockPath, (arr, idx) => {
                    arr.splice(idx, 1);
                });
                setIsFooterDirty(true);
                setHasUnpublishedChanges(true);
                return { ...prev, content: newBlocks, has_changes: true };
            });
            if (String(selectedElementRef.current.id) === String(colBlockPath)) {
                setSelectedElement({ type: null, id: null, data: null });
            }
            return true;
        }

        if (sectionId === 'header') {
            setHeaderData(prev => {
                const { blocks: newBlocks } = updateNestedBlocks(prev.content, colBlockPath, (arr, idx) => {
                    arr.splice(idx, 1);
                });
                setIsHeaderDirty(true);
                setHasUnpublishedChanges(true);
                return { ...prev, content: newBlocks, has_changes: true };
            });
            if (String(selectedElementRef.current.id) === String(colBlockPath)) {
                setSelectedElement({ type: null, id: null, data: null });
            }
            return true;
        }

        setPageData(prev => {
            const newSections = prev.sections.map(section => {
                if (section.id !== sectionId) return section;

                const { blocks: newBlocks } = updateNestedBlocks(section.blocks, colBlockPath, (arr, idx) => {
                    arr.splice(idx, 1);
                });

                return { ...section, blocks: newBlocks, has_changes: true };
            });
            return { ...prev, sections: newSections };
        });

        if (String(selectedElementRef.current.id) === String(colBlockPath)) {
            setSelectedElement({ type: null, id: null, data: null });
        }
        return true;
    };

    const moveBlock = (sectionId, blockPath, direction) => {
        saveHistory();
        
        let newSelectedPath = null;

        if (sectionId === 'footer') {
            setFooterData(prev => {
                const { blocks: newBlocks } = updateNestedBlocks(prev.content, blockPath, (arr, idx) => {
                    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
                    if (targetIdx >= 0 && targetIdx < arr.length) {
                        [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
                        const pathArr = String(blockPath).split('-');
                        pathArr[pathArr.length - 1] = targetIdx;
                        newSelectedPath = pathArr.join('-');
                    }
                });
                if (newSelectedPath) {
                    setIsFooterDirty(true);
                    setHasUnpublishedChanges(true);
                    return { ...prev, content: newBlocks, has_changes: true };
                }
                return prev;
            });
        } else if (sectionId === 'header') {
            setHeaderData(prev => {
                const { blocks: newBlocks } = updateNestedBlocks(prev.content, blockPath, (arr, idx) => {
                    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
                    if (targetIdx >= 0 && targetIdx < arr.length) {
                        [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
                        const pathArr = String(blockPath).split('-');
                        pathArr[pathArr.length - 1] = targetIdx;
                        newSelectedPath = pathArr.join('-');
                    }
                });
                if (newSelectedPath) {
                    setIsHeaderDirty(true);
                    setHasUnpublishedChanges(true);
                    return { ...prev, content: newBlocks, has_changes: true };
                }
                return prev;
            });
        } else {
            setPageData(prev => {
                const newSections = prev.sections.map(section => {
                    if (section.id !== sectionId) return section;

                    const { blocks: newBlocks } = updateNestedBlocks(section.blocks, blockPath, (arr, idx) => {
                        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
                        if (targetIdx >= 0 && targetIdx < arr.length) {
                            [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
                            const pathArr = String(blockPath).split('-');
                            pathArr[pathArr.length - 1] = targetIdx;
                            newSelectedPath = pathArr.join('-');
                        }
                    });

                    if (newSelectedPath) {
                        return { ...section, blocks: newBlocks, has_changes: true };
                    }
                    return section;
                });
                return { ...prev, sections: newSections };
            });
        }

        if (newSelectedPath && selectedElementRef.current && String(selectedElementRef.current.id) === String(blockPath)) {
            setSelectedElement(prev => ({ ...prev, id: newSelectedPath }));
        }
    };

    const addSection = async (templateKey, name) => {
        if (!activePage?.id) return;
        saveHistory();
        try {
            const response = await api.post('/api/cms/sections', {
                id_page: activePage.id,
                template: templateKey,
                section_name: name
            });
            if (response.data.success) {
                setPageData(prev => ({
                    ...prev,
                    sections: [...prev.sections, response.data.data]
                }));
            }
        } catch (error) {
            console.error('Failed to add section:', error);
        }
    };

    const removeSection = async (id) => {
        saveHistory();
        try {
            const response = await api.patch(`/api/cms/sections/${id}/delete`);
            if (response.data.success) {
                setPageData(prev => ({
                    ...prev,
                    sections: prev.sections.filter(section => section.id !== id)
                }));
            }
        } catch (error) {
            console.error('Failed to remove section:', error);
        }
    };

    const addPage = async (data) => {
        try {
            const response = await api.post('/api/cms/pages', data);
            if (response.data.success) {
                await fetchPages();
                return response.data.data;
            }
        } catch (error) {
            console.error('Failed to add page:', error);
        }
        return null;
    };

    const updatePage = async (id, data) => {
        try {
            const response = await api.put(`/api/cms/pages/${id}`, data);
            if (response.data.success) {
                await fetchPages();
                if (activePage?.id === id) {
                    await fetchPageData(id);
                }
                return true;
            }
        } catch (error) {
            console.error('Failed to update page:', error);
        }
        return false;
    };

    const deletePage = async (id) => {
        try {
            const response = await api.patch(`/api/cms/pages/${id}/delete`);
            if (response.data.success) {
                await fetchPages();
                return true;
            }
        } catch (error) {
            console.error('Failed to delete page:', error);
        }
        return false;
    };

    const unpublishPage = async (id) => {
        return await updatePage(id, { status: 'draft' });
    };

    const publishPageById = async (id) => {
        try {
            const response = await api.post(`/api/cms/pages/${id}/publish`);
            if (response.data.success) {
                await fetchPages();
                return true;
            }
        } catch (error) {
            console.error('Failed to publish page:', error);
        }
        return false;
    };

    const PageForm = ({ initialData, onSubmit, formId }) => {
        const [formData, setFormData] = useState(initialData);

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
        };

        return (
            <form id={formId} className='form-case' onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
                <FormInput label="Page Title" placeholder='Page Title' name="title" value={formData.title} onChange={handleChange} required />
                <div className='form-row'>
                    <div className='w6'><FormInput label="Page Slug" name="slug" placeholder='Page Slug' value={formData.slug} onChange={handleChange} required /></div>
                    <div className='w4'><FormSelect label="Status" name="status" value={formData.status} onChange={handleChange} options={[{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]} /></div>
                </div>
                <FormInput label="Meta Title" placeholder='Meta Title' name="meta_title" value={formData.meta_title} onChange={handleChange} />
                <FormTextarea label="Meta Description" placeholder='Meta Description' name="meta_desc" value={formData.meta_desc} onChange={handleChange} />
                <div className='form-row'>
                    <div className='w5'><FormToggle label="Show Header" name="has_header" checked={!!formData.has_header} onChange={handleChange} /></div>
                    <div className='w5'><FormToggle label="Show Footer" name="has_footer" checked={!!formData.has_footer} onChange={handleChange} /></div>
                </div>
            </form>
        );
    };

    const openPageModal = (page = null) => {
        const isEdit = !!page;
        const initialData = isEdit ? {
            title: page.title,
            slug: page.slug,
            status: page.status,
            meta_title: page.meta_title || '',
            meta_desc: page.meta_desc || '',
            has_header: page.has_header ?? 1,
            has_footer: page.has_footer ?? 1
        } : {
            title: '',
            slug: '',
            status: 'draft',
            meta_title: '',
            meta_desc: '',
            has_header: 1,
            has_footer: 1
        };

        const handleSubmit = async (formData) => {
            if (!formData.title || !formData.slug) {
                showAlert({ title: 'Validation Error', content: 'Title and Slug are required.', style: 'error' });
                return;
            }

            const result = isEdit ? await updatePage(page.id, formData) : await addPage(formData);
            if (result) {
                closePopup();
            } else {
                showAlert({
                    title: 'Error',
                    content: isEdit ? 'Failed to update page.' : 'Failed to create page. Slug might already exist.',
                    style: 'error'
                });
            }
        };

        openPopup({
            title: isEdit ? `Edit Page: ${page.title}` : 'Add New Page',
            content: <PageForm initialData={initialData} onSubmit={handleSubmit} formId="page_modal_form" />,
            widthClass: 'w-mm',
            actions: [
                { text: 'Cancel', icon: icons.times, onClick: closePopup, className: 'btn-outlined' },
                {
                    text: isEdit ? 'Update' : 'Create',
                    icon: isEdit ? icons.save : icons.add,
                    onClick: () => document.getElementById('page_modal_form')?.requestSubmit()
                }
            ]
        });
    };

    const handleAddPage = () => openPageModal();
    const handleEditPage = (page) => openPageModal(page);

    const confirmDelete = (page) => {
        showAlert({
            title: 'Confirm Delete',
            content: `Are you sure you want to delete the page "${page.title}"? This action cannot be undone.`,
            isAlert: true,
            style: 'error',
            actions: [
                { text: 'Cancel', onClick: closePopup, className: 'btn-outlined' },
                { text: 'Delete', icon: icons.delete, className: 'btn-danger', onClick: async () => { await deletePage(page.id); closePopup(); } }
            ]
        });
    };

    const confirmDraft = (page) => {
        showAlert({
            title: 'Confirm Draft',
            content: `Are you sure you want to move "${page.title}" to drafts? It will no longer be visible to the public.`,
            isAlert: true,
            style: 'warning',
            actions: [
                { text: 'Cancel', onClick: closePopup, className: 'btn-outlined' },
                { text: 'Move to Draft', icon: icons.archive, onClick: async () => { await unpublishPage(page.id); closePopup(); } }
            ]
        });
    };

    const confirmPublish = (page, onConfirm) => {
        showAlert({
            title: 'Confirm Publish',
            content: `Are you sure you want to publish "${page.title}"? It will be visible to the public.`,
            isAlert: true,
            style: 'success',
            actions: [
                { text: 'Cancel', onClick: closePopup, className: 'btn-outlined' },
                { text: 'Move to Publish', icon: icons.send, onClick: async () => { closePopup(); if (onConfirm) await onConfirm(page); } }
            ]
        });
    };

    return (
        <CMSContext.Provider value={{
            pages,
            activePage,
            selectPage,
            pageData,
            templates,
            loading,
            updateSection,
            addSection,
            removeSection,
            savePageDraft,
            publishPage,
            publishPageById,
            addPage,
            updatePage,
            deletePage,
            unpublishPage,
            refreshPages: fetchPages,
            selectedElement,
            setSelectedElement,
            activeStyleState,
            setActiveStyleState,
            isDirty: isDirty || isFooterDirty || isHeaderDirty,
            setIsDirty,
            hasUnpublishedChanges,
            setHasUnpublishedChanges,
            view,
            setView,
            undo,
            redo,
            canUndo: history.length > 0,
            canRedo: future.length > 0,
            updateSectionSetting,
            updateBlockContent,
            updateBlockProperty,
            updateNavigationProperty,
            addNavigation,
            removeNavigation,
            reorderNavigations,
            addBlock,
            deleteBlock,
            moveBlock,
            addColumnToRow,
            removeColumnFromRow,
            handleAddPage,
            handleEditPage,
            confirmDelete,
            confirmDraft,
            confirmPublish,
            getElementByPath,
            footerData,
            setFooterData,
            isFooterDirty,
            setIsFooterDirty,
            fetchFooterData,
            headerData,
            setHeaderData,
            isHeaderDirty,
            setIsHeaderDirty,
            fetchHeaderData,
            navigations,
            setNavigations,
            fetchNavigations
        }}>
            {children}
        </CMSContext.Provider>
    );
};


