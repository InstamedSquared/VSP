// /proj1/client/src/context/TooltipContext.js
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

const TooltipContext = createContext();

export const useTooltip = () => useContext(TooltipContext);

// The actual Tooltip DOM element component
const Tooltip = ({ content, referenceElement, placement, theme }) => {
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);

    const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
        placement: placement || 'top',
        modifiers: [
            { name: 'offset', options: { offset: [0, 8] } },
            { name: 'flip', options: { fallbackPlacements: ['bottom', 'left', 'right'] } },
            { name: 'preventOverflow', options: { padding: 10 } },
            { name: 'arrow', options: { element: arrowElement } },
        ],
    });

    useEffect(() => { if (update) update(); }, [content, update]);

    const themeClass = `tooltip-theme-${theme}`;

    return createPortal(
        <div ref={setPopperElement} style={styles.popper} {...attributes.popper} className={`tooltip-container ${themeClass}`} role="tooltip" >
            {content}
            <div ref={setArrowElement} style={styles.arrow} className="tooltip-arrow" />
        </div>,
        document.body
    );
};

export const TooltipProvider = ({ children }) => {
    const [tooltipState, setTooltipState] = useState({
        isOpen: false,
        referenceElement: null,
        content: null,
        placement: 'top',
        theme: 'dark',
    });

    const showTooltip = useCallback(({ referenceElement, content, placement = 'top', theme = 'dark' }) => {
        setTooltipState({
            isOpen: true,
            referenceElement,
            content,
            placement,
            theme,
        });
    }, []);

    const hideTooltip = useCallback(() => { setTooltipState(prev => ({ ...prev, isOpen: false })); }, []);

    const value = useMemo(() => ({
        showTooltip,
        hideTooltip
    }), [showTooltip, hideTooltip]);

    return (
        <TooltipContext.Provider value={value}>
            {children}
            {tooltipState.isOpen && (
                <Tooltip
                    referenceElement={tooltipState.referenceElement}
                    content={tooltipState.content}
                    placement={tooltipState.placement}
                    theme={tooltipState.theme} />
            )}
        </TooltipContext.Provider>);
};