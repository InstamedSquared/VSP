import React, { useRef } from 'react';
import { useCMS } from '../../context/CMSContext';

const CmsSection = ({ section, renderBlocks }) => {
    const { view, selectedElement, setSelectedElement, updateSectionSetting, activeStyleState } = useCMS();
    const sectionRef = useRef(null);

    const s = section.settings || {};
    const t = s.responsive?.tablet || {};
    const m = s.responsive?.mobile || {};
    
    const style = {};

    // Helper to set a CSS variable
    const setVar = (varName, value) => {
        if (value !== undefined && value !== null && value !== '') {
            style[varName] = value;
        }
    };

    // Apply base section settings
    setVar('--sec-bg-color', s.bgColor);
    if (s.bgImage) style['--sec-bg-image'] = `url(${s.bgImage})`;
    setVar('--sec-padding', s.padding);
    setVar('--sec-margin', s.margin);
    setVar('--sec-height', s.height);
    if (s.bgOpacity !== undefined && s.bgOpacity !== 1) style['--sec-opacity'] = s.bgOpacity;
    setVar('--sec-overlay-color', s.overlayColor);
    if (s.overlayOpacity !== undefined && s.overlayOpacity !== 0) style['--sec-overlay-opacity'] = s.overlayOpacity;
    setVar('--sec-bg-position', s.bgPosition);
    setVar('--sec-bg-repeat', s.bgRepeat);
    setVar('--sec-bg-size', s.bgSize);
    setVar('--sec-font-size', s.fontSize);
    setVar('--sec-font-weight', s.fontWeight);
    setVar('--sec-font-style', s.fontStyle);
    setVar('--sec-text-decoration', s.textDecoration);
    setVar('--sec-color', s.color);
    setVar('--sec-border-width', s.borderWidth);
    setVar('--sec-border-style', s.borderStyle);
    setVar('--sec-border-color', s.borderColor);
    setVar('--sec-border-radius', s.borderRadius);
    setVar('--sec-box-shadow', s.boxShadow);
    setVar('--sec-transition', s.transition);

    // Section interaction state styles (using --s-* naming matching responsive-variables.css)
    setVar('--s-hover-bg-color', s.hoverBgColor);
    setVar('--s-hover-color', s.hoverColor);
    setVar('--s-hover-border-color', s.hoverBorderColor);
    setVar('--s-active-bg-color', s.activeBgColor);
    setVar('--s-hover-font-size', s.hoverFontSize);
    setVar('--s-hover-font-weight', s.hoverFontWeight);
    setVar('--s-hover-font-style', s.hoverFontStyle);
    setVar('--s-hover-text-decoration', s.hoverTextDecoration);
    setVar('--s-active-color', s.activeColor);
    setVar('--s-focus-color', s.focusColor);
    setVar('--s-focus-bg-color', s.focusBgColor);

    // Apply viewport-specific overrides based on editor view state
    // In the editor, CSS @media queries won't fire (fixed viewport), so we apply
    // the responsive values inline based on the current view mode
    if (view === 'tablet') {
        setVar('--sec-bg-color', t.bgColor);
        if (t.bgImage) style['--sec-bg-image'] = `url(${t.bgImage})`;
        setVar('--sec-padding', t.padding);
        setVar('--sec-margin', t.margin);
        setVar('--sec-height', t.height);
        setVar('--sec-font-size', t.fontSize);
        setVar('--sec-font-weight', t.fontWeight);
        setVar('--sec-font-style', t.fontStyle);
        setVar('--sec-text-decoration', t.textDecoration);
        setVar('--sec-color', t.color);
        setVar('--sec-border-width', t.borderWidth);
        setVar('--sec-border-color', t.borderColor);
        setVar('--sec-border-radius', t.borderRadius);
        setVar('--sec-box-shadow', t.boxShadow);
        setVar('--sec-transition', t.transition);
        setVar('--sec-overlay-color', t.overlayColor);
        if (t.overlayOpacity !== undefined && t.overlayOpacity !== 0) style['--sec-overlay-opacity'] = t.overlayOpacity;
    } else if (view === 'mobile') {
        // Mobile overrides tablet too (cascade: mobile → tablet → base)
        setVar('--sec-bg-color', m.bgColor || t.bgColor);
        if (m.bgImage || t.bgImage) style['--sec-bg-image'] = `url(${m.bgImage || t.bgImage})`;
        setVar('--sec-padding', m.padding || t.padding);
        setVar('--sec-margin', m.margin || t.margin);
        setVar('--sec-height', m.height || t.height);
        setVar('--sec-font-size', m.fontSize || t.fontSize);
        setVar('--sec-font-weight', m.fontWeight || t.fontWeight);
        setVar('--sec-font-style', m.fontStyle || t.fontStyle);
        setVar('--sec-text-decoration', m.textDecoration || t.textDecoration);
        setVar('--sec-color', m.color || t.color);
        setVar('--sec-border-width', m.borderWidth || t.borderWidth);
        setVar('--sec-border-color', m.borderColor || t.borderColor);
        setVar('--sec-border-radius', m.borderRadius || t.borderRadius);
        setVar('--sec-box-shadow', m.boxShadow || t.boxShadow);
        setVar('--sec-transition', m.transition || t.transition);
        setVar('--sec-overlay-color', m.overlayColor || t.overlayColor);
        if ((m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity) !== undefined && 
            (m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity) !== 0) {
            style['--sec-overlay-opacity'] = m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity;
        }
    }

    // Also output viewport-specific responsive variables for the CSS cascade
    // These feed the @media queries in responsive-variables.css (useful if editor uses iframe)
    setVar('--s-tablet-bg-color', t.bgColor);
    setVar('--s-tablet-padding', t.padding);
    setVar('--s-tablet-margin', t.margin);
    setVar('--s-tablet-height', t.height);
    setVar('--s-tablet-font-size', t.fontSize);
    setVar('--s-tablet-font-weight', t.fontWeight);
    setVar('--s-tablet-font-style', t.fontStyle);
    setVar('--s-tablet-text-decoration', t.textDecoration);
    setVar('--s-tablet-color', t.color);
    setVar('--s-tablet-border-width', t.borderWidth);
    setVar('--s-tablet-border-color', t.borderColor);
    setVar('--s-tablet-border-radius', t.borderRadius);
    setVar('--s-tablet-box-shadow', t.boxShadow);
    setVar('--s-tablet-transition', t.transition);
    setVar('--s-tablet-bg-position', t.bgPosition);
    setVar('--s-tablet-bg-repeat', t.bgRepeat);
    setVar('--s-tablet-bg-size', t.bgSize);
    if (t.bgImage) style['--s-tablet-bg-image'] = `url(${t.bgImage})`;
    setVar('--s-tablet-overlay-color', t.overlayColor);
    if (t.overlayOpacity !== undefined && t.overlayOpacity !== 0) style['--s-tablet-overlay-opacity'] = t.overlayOpacity;

    setVar('--s-mobile-bg-color', m.bgColor);
    setVar('--s-mobile-padding', m.padding);
    setVar('--s-mobile-margin', m.margin);
    setVar('--s-mobile-height', m.height);
    setVar('--s-mobile-font-size', m.fontSize);
    setVar('--s-mobile-font-weight', m.fontWeight);
    setVar('--s-mobile-font-style', m.fontStyle);
    setVar('--s-mobile-text-decoration', m.textDecoration);
    setVar('--s-mobile-color', m.color);
    setVar('--s-mobile-border-width', m.borderWidth);
    setVar('--s-mobile-border-color', m.borderColor);
    setVar('--s-mobile-border-radius', m.borderRadius);
    setVar('--s-mobile-box-shadow', m.boxShadow);
    setVar('--s-mobile-transition', m.transition);
    setVar('--s-mobile-bg-position', m.bgPosition);
    setVar('--s-mobile-bg-repeat', m.bgRepeat);
    setVar('--s-mobile-bg-size', m.bgSize);
    if (m.bgImage) style['--s-mobile-bg-image'] = `url(${m.bgImage})`;
    setVar('--s-mobile-overlay-color', m.overlayColor);
    if (m.overlayOpacity !== undefined && m.overlayOpacity !== 0) style['--s-mobile-overlay-opacity'] = m.overlayOpacity;

    const isSelected = selectedElement.id === section.id && selectedElement.type === 'section';
    const isChildActive = selectedElement.sectionId === section.id;

    // --- Resize Logic ---
    const handleResizeStart = (e) => {
        if (!isSelected) return;
        e.stopPropagation();
        e.preventDefault();

        const startY = e.clientY;
        const startHeight = sectionRef.current.offsetHeight;
        
        const originalTransition = sectionRef.current.style.transition;
        sectionRef.current.style.transition = 'none';

        const handleMouseMove = (moveEvent) => {
            const deltaY = moveEvent.clientY - startY;
            const newHeight = Math.max(80, startHeight + deltaY); // Minimum 80px height
            if (sectionRef.current) {
                sectionRef.current.style.setProperty('--sec-height', `${newHeight}px`);
            }
        };

        const handleMouseUp = (upEvent) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            if (sectionRef.current) {
                sectionRef.current.style.transition = originalTransition;
            }
            
            const deltaY = upEvent.clientY - startY;
            const finalHeight = Math.max(80, startHeight + deltaY);
            updateSectionSetting(section.id, 'height', `${finalHeight}px`);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const stateSimClass = isSelected && activeStyleState !== 'normal' ? `cms-simulate-${activeStyleState}` : '';
    const visibilityClass = [
        s.hideDesktop ? 'd-none-desktop' : '',
        s.hideTablet ? 'd-none-tablet' : '',
        s.hideMobile ? 'd-none-mobile' : ''
    ].filter(Boolean).join(' ');

    const secClass = `seczone cms-sec-${section.id} ${isSelected ? 'active' : ''} ${isChildActive ? 'child-active' : ''} ${s.hoverBgColor ? 'has-hover-bg' : ''} ${s.hoverColor ? 'has-hover-color' : ''} ${s.hoverBorderColor ? 'has-hover-border' : ''} ${s.activeBgColor ? 'has-active-bg' : ''} ${s.hoverScale === 'zoom' ? 'hover-zoom' : ''} ${stateSimClass} ${visibilityClass}`.trim();

    return (
        <div
            ref={sectionRef}
            className={secClass}
            data-cms-active={isSelected ? 'true' : undefined}
            data-cms-child-active={isChildActive ? 'true' : undefined}
            style={style}
            onClick={(e) => {
                if (e.target.closest('.seczone-block') || e.target.closest('.seczone-layout')) {
                    return;
                }
                e.stopPropagation();
                setSelectedElement({ type: 'section', id: section.id, data: section });
            }}
        >
            <div className="seczone-in">
                {s.layout === 'flex-block' ? (
                    <div
                        className={`flex-block ${s.innerClass || ''}`}
                        style={{
                            gap: s.gap,
                            flexDirection: s.flexDirection,
                            alignItems: s.alignItems,
                            justifyContent: s.justifyContent,
                        }}
                    >
                        {renderBlocks(section.blocks, section.id)}
                    </div>
                ) : (
                    <div className={s.innerClass || ''}>
                        {renderBlocks(section.blocks, section.id)}
                    </div>
                )}
            </div>
            {isSelected && (
                <div
                    className="section-resize-handle"
                    onMouseDown={handleResizeStart}
                >
                    <span className="resize-handle-dots"></span>
                </div>
            )}
        </div>
    );
};

export default CmsSection;