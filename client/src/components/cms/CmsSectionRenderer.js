import React from 'react';
import CmsBlockRenderer from './CmsBlockRenderer';

const CmsSectionRenderer = ({ section }) => {
    if (!section) return null;

    const s = typeof section.settings === 'string' ? JSON.parse(section.settings) : (section.settings || {});
    const blocks = typeof section.blocks === 'string' ? JSON.parse(section.blocks) : (section.blocks || []);
    const t = s.responsive?.tablet || {};
    const m = s.responsive?.mobile || {};
    
    const style = {};

    // Helper to set a CSS variable
    const setVar = (varName, value) => {
        if (value !== undefined && value !== null && value !== '') {
            style[varName] = value;
        }
    };

    // Base section settings
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
    setVar('--sec-color', s.color);
    setVar('--sec-border-width', s.borderWidth);
    setVar('--sec-border-style', s.borderStyle);
    setVar('--sec-border-color', s.borderColor);
    setVar('--sec-border-radius', s.borderRadius);
    setVar('--sec-box-shadow', s.boxShadow);
    setVar('--sec-transition', s.transition);

    // Section interaction state styles
    setVar('--s-hover-bg-color', s.hoverBgColor);
    setVar('--s-hover-color', s.hoverColor);
    setVar('--s-hover-border-color', s.hoverBorderColor);
    setVar('--s-active-bg-color', s.activeBgColor);
    setVar('--s-hover-font-size', s.hoverFontSize);
    setVar('--s-hover-font-weight', s.hoverFontWeight);
    setVar('--s-hover-font-style', s.hoverFontStyle);
    setVar('--s-active-color', s.activeColor);
    setVar('--s-focus-color', s.focusColor);
    setVar('--s-focus-bg-color', s.focusBgColor);

    // Tablet settings
    setVar('--s-tablet-bg-color', t.bgColor);
    if (t.bgImage) style['--s-tablet-bg-image'] = `url(${t.bgImage})`;
    setVar('--s-tablet-padding', t.padding);
    setVar('--s-tablet-margin', t.margin);
    setVar('--s-tablet-height', t.height);
    setVar('--s-tablet-font-size', t.fontSize);
    setVar('--s-tablet-font-weight', t.fontWeight);
    setVar('--s-tablet-color', t.color);
    setVar('--s-tablet-border-width', t.borderWidth);
    setVar('--s-tablet-border-color', t.borderColor);
    setVar('--s-tablet-border-radius', t.borderRadius);
    setVar('--s-tablet-box-shadow', t.boxShadow);
    setVar('--s-tablet-transition', t.transition);
    setVar('--s-tablet-bg-position', t.bgPosition);
    setVar('--s-tablet-bg-repeat', t.bgRepeat);
    setVar('--s-tablet-bg-size', t.bgSize);
    setVar('--s-tablet-overlay-color', t.overlayColor);
    if (t.overlayOpacity !== undefined && t.overlayOpacity !== 0) style['--s-tablet-overlay-opacity'] = t.overlayOpacity;

    // Mobile settings
    setVar('--s-mobile-bg-color', m.bgColor);
    if (m.bgImage) style['--s-mobile-bg-image'] = `url(${m.bgImage})`;
    setVar('--s-mobile-padding', m.padding);
    setVar('--s-mobile-margin', m.margin);
    setVar('--s-mobile-height', m.height);
    setVar('--s-mobile-font-size', m.fontSize);
    setVar('--s-mobile-font-weight', m.fontWeight);
    setVar('--s-mobile-color', m.color);
    setVar('--s-mobile-border-width', m.borderWidth);
    setVar('--s-mobile-border-color', m.borderColor);
    setVar('--s-mobile-border-radius', m.borderRadius);
    setVar('--s-mobile-box-shadow', m.boxShadow);
    setVar('--s-mobile-transition', m.transition);
    setVar('--s-mobile-bg-position', m.bgPosition);
    setVar('--s-mobile-bg-repeat', m.bgRepeat);
    setVar('--s-mobile-bg-size', m.bgSize);
    setVar('--s-mobile-overlay-color', m.overlayColor);
    if (m.overlayOpacity !== undefined && m.overlayOpacity !== 0) style['--s-mobile-overlay-opacity'] = m.overlayOpacity;

    const visibilityClass = [
        s.hideDesktop ? 'd-none-desktop' : '',
        s.hideTablet ? 'd-none-tablet' : '',
        s.hideMobile ? 'd-none-mobile' : ''
    ].filter(Boolean).join(' ');

    const secClass = `seczone cms-sec-${section.id} ${s.hoverBgColor ? 'has-hover-bg' : ''} ${s.hoverColor ? 'has-hover-color' : ''} ${s.hoverBorderColor ? 'has-hover-border' : ''} ${s.activeBgColor ? 'has-active-bg' : ''} ${s.hoverScale === 'zoom' ? 'hover-zoom' : ''} ${visibilityClass}`.trim();

    return (
        <div className={secClass} style={style}>
            <div className="seczone-in">
                {s.layout === 'flex-block' ? (
                    <div
                        className={`flex-block ${s.innerClass || ''}`}
                        style={{
                            gap: s.gap,
                            alignItems: s.alignItems,
                            justifyContent: s.justifyContent,
                        }}
                    >
                        {blocks?.map((block, idx) => (
                            <CmsBlockRenderer key={idx} block={block} sectionId={section.id} parentPath={`${idx}`} />
                        ))}
                    </div>
                ) : (
                    <div className={s.innerClass || ''}>
                        {blocks?.map((block, idx) => (
                            <CmsBlockRenderer key={idx} block={block} sectionId={section.id} parentPath={`${idx}`} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CmsSectionRenderer;