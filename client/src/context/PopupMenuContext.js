import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import useDetectOutsideClick from '../hooks/useDetectOutsideClick';

const PopupMenuContext = createContext();

export const usePopupMenu = () => useContext(PopupMenuContext);

const PopupMenu = ({ content, referenceElement, placement, onClose }) => {
    const [popperElement, setPopperElement] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    //bottom-end, left-start, top-end, 
    const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
        placement: placement || 'bottom-end',
        modifiers: [
            { name: 'offset', options: { offset: [0, 8] } },
            { name: 'flip', options: { fallbackPlacements: ['top-end', 'left-start'] } },
            { name: 'preventOverflow', options: { padding: 10 } },
        ],
    });

    useEffect(() => { if (update) { update(); } }, [content, update]);
    useDetectOutsideClick({ current: popperElement }, onClose);

    return createPortal(
        <div
            ref={setPopperElement}
            style={{ ...styles.popper, opacity: mounted ? 1 : 0 }} // Initially invisible
            {...attributes.popper}
            className="popup-menu-container"
        >
            {content}
        </div>,
        document.body
    );
};

export const PopupMenuProvider = ({ children }) => {
    const [menuState, setMenuState] = useState({
        isOpen: false,
        referenceElement: null,
        content: null,
        placement: 'bottom-end',
    });

    const openPopupMenu = useCallback(({ referenceElement, content, placement = 'bottom-end' }) => {
        setMenuState({
            isOpen: true,
            referenceElement,
            content,
            placement,
        });
    }, []);

    const closePopupMenu = useCallback(() => {
        setMenuState(prev => ({ ...prev, isOpen: false, referenceElement: null }));
    }, []);

    const value = useMemo(() => ({
        openPopupMenu,
        closePopupMenu
    }), [openPopupMenu, closePopupMenu]);

    return (
        <PopupMenuContext.Provider value={value}>
            {children}
            {menuState.isOpen && (
                <PopupMenu
                    referenceElement={menuState.referenceElement}
                    content={menuState.content}
                    placement={menuState.placement}
                    onClose={closePopupMenu}
                />
            )}
        </PopupMenuContext.Provider>
    );
};