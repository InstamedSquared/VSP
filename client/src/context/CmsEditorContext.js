import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export const CmsEditorContext = createContext();

export const useCmsEditor = () => {
    const context = useContext(CmsEditorContext);
    if (!context) {
        throw new Error('useCmsEditor must be used within a CmsEditorProvider');
    }
    return context;
};

export const CmsEditorProvider = ({ children, initialData, onUpdate, onPublish, onAddSection, onDeleteSection, onReorderSections, activeDevice, setActiveDevice }) => {
    const [pageData, setPageData] = useState(initialData);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedType, setSelectedType] = useState(null); // 'section' or 'block'
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
    const [templates, setTemplates] = useState([]);
    const [isDirty, setIsDirty] = useState(false);
    const [history, setHistory] = useState([initialData]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const isUndoingRedoing = useRef(false);

    // Sync pageData with initialData when it changes (e.g. after publish)
    useEffect(() => {
        if (initialData) {
            setPageData(initialData);
            setHistory([initialData]);
            setHistoryIndex(0);
        }
    }, [initialData]);

    const pushToHistory = useCallback((newData) => {
        if (isUndoingRedoing.current) return;
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            return [...newHistory, newData].slice(-50); // Keep last 50 steps
        });
        setHistoryIndex(prev => {
            const newIdx = Math.min(prev + 1, 49);
            return newIdx;
        });
    }, [historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            isUndoingRedoing.current = true;
            const prevIndex = historyIndex - 1;
            const prevState = history[prevIndex];
            setPageData(prevState);
            setHistoryIndex(prevIndex);
            setIsDirty(prevIndex !== 0);
            setTimeout(() => { isUndoingRedoing.current = false; }, 0);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            isUndoingRedoing.current = true;
            const nextIndex = historyIndex + 1;
            const nextState = history[nextIndex];
            setPageData(nextState);
            setHistoryIndex(nextIndex);
            setIsDirty(nextIndex !== 0);
            setTimeout(() => { isUndoingRedoing.current = false; }, 0);
        }
    }, [history, historyIndex]);

    const selectElement = useCallback((id, type) => {
        setSelectedId(id);
        setSelectedType(type);
    }, []);

    const updateSectionSettings = useCallback((sectionId, newSettings) => {
        const newData = {
            ...pageData,
            sections: pageData.sections.map(s => 
                s.id === sectionId ? { ...s, settings: newSettings } : s
            )
        };
        setPageData(newData);
        pushToHistory(newData);
        setSaveStatus('saving');
        setIsDirty(true);
        onUpdate('section', sectionId, { settings: JSON.stringify(newSettings) })
            .then(() => setSaveStatus('saved'))
            .catch(() => setSaveStatus('error'));
    }, [onUpdate, setIsDirty, pageData, pushToHistory]);

    const updateBlockContent = useCallback((blockId, newContent, newProperties) => {
        const newData = {
            ...pageData,
            sections: pageData.sections.map(s => ({
                ...s,
                blocks: (s.blocks || []).map(b => 
                    b.id === blockId ? { ...b, content: newContent, properties: newProperties } : b
                )
            }))
        };
        setPageData(newData);
        pushToHistory(newData);
        setSaveStatus('saving');
        setIsDirty(true);
        onUpdate('block', blockId, { 
            content: newContent, 
            properties: typeof newProperties === 'string' ? newProperties : JSON.stringify(newProperties) 
        })
            .then(() => setSaveStatus('saved'))
            .catch(() => setSaveStatus('error'));
    }, [onUpdate, setIsDirty, pageData, pushToHistory]);

    const deleteSection = useCallback(async (id) => {
        if (selectedId === id) {
            setSelectedId(null);
            setSelectedType(null);
        }
        await onDeleteSection(id);
        const newData = {
            ...pageData,
            sections: pageData.sections.filter(s => s.id !== id)
        };
        setPageData(newData);
        pushToHistory(newData);
        setIsDirty(true);
    }, [selectedId, onDeleteSection, pageData, pushToHistory, setIsDirty, setSelectedId, setSelectedType]);

    const addSection = useCallback((template) => {
        const newSection = {
            id: `temp-${Date.now()}`,
            id_page: pageData.page.id,
            template: template.template_key,
            section_name: template.name,
            settings: {},
            blocks: [],
            is_new: true,
            category_name: template.name, // For the structure panel name
            short_description: template.category || 'section' // For the structure panel small
        };

        const newData = {
            ...pageData,
            sections: [...(pageData.sections || []), newSection]
        };
        setPageData(newData);
        pushToHistory(newData);
        setIsDirty(true);
        selectElement(newSection.id, 'section');
    }, [pageData, selectElement, pushToHistory, setIsDirty]);

    const reorderSections = useCallback(async (direction) => {
        if (selectedType !== 'section') return;
        const index = pageData.sections.findIndex(s => s.id === selectedId);
        if (index === -1) return;

        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= pageData.sections.length) return;

        const newSections = [...pageData.sections];
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        
        const newData = { ...pageData, sections: newSections };
        setPageData(newData);
        pushToHistory(newData);
        setIsDirty(true);
        await onReorderSections(newSections.map(s => s.id));
    }, [pageData.sections, selectedId, selectedType, onReorderSections, pageData, pushToHistory, setIsDirty]);

    if (!pageData) return null;

    const value = {
        pageData,
        selectedId,
        selectedType,
        saveStatus,
        templates,
        setTemplates,
        selectElement,
        updateSectionSettings,
        updateBlockContent,
        deleteSection,
        addSection,
        reorderSections,
        onPublish,
        activeDevice,
        setActiveDevice,
        isDirty,
        setIsDirty,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1
    };

    return (
        <CmsEditorContext.Provider value={value}>
            {children}
        </CmsEditorContext.Provider>
    );
};
