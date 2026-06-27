import React from 'react';
import Icon from '../common/Icon';
import { icons } from '../../config/icons';

const CmsBlockRenderer = ({ block, sectionId, parentPath = '' }) => {
    if (!block) return null;

    const isLayout = block.block_type === 'container';
    const rawProperties = typeof block.properties === 'string' ? JSON.parse(block.properties) : (block.properties || {});
    const rawResponsive = typeof block.responsive === 'string' ? JSON.parse(block.responsive) : (block.responsive || {});
    const tProps = rawResponsive?.tablet?.properties || {};
    const mProps = rawResponsive?.mobile?.properties || {};
    const blocks = typeof block.blocks === 'string' ? JSON.parse(block.blocks) : (block.blocks || []);
    
    // CSS variable mapping — output all viewport variants
    const bVars = {};

    // Helper to set a CSS variable
    const setVar = (varName, value) => {
        if (value !== undefined && value !== null && value !== '') {
            bVars[varName] = value;
        }
    };

    // Map base properties to CSS variables
    const baseProps = rawProperties;
    setVar('--b-text-align', baseProps['text-align']);
    setVar('--b-color', baseProps['color']);
    setVar('--b-font-size', baseProps['font-size']);
    setVar('--b-font-weight', baseProps['font-weight']);
    setVar('--b-font-style', baseProps['font-style']);
    setVar('--b-text-decoration', baseProps['text-decoration']);
    setVar('--b-margin-bottom', baseProps['margin-bottom']);
    setVar('--b-margin-top', baseProps['margin-top']);
    setVar('--b-margin', baseProps['margin']);
    setVar('--b-padding', baseProps['padding']);
    setVar('--b-border-radius', baseProps['border-radius']);
    // Use layout-specific variable for containers to prevent CSS cascade to children
    if (isLayout) {
        setVar('--b-layout-bg-color', baseProps['bg-color']);
    } else {
        setVar('--b-bg-color', baseProps['bg-color']);
    }
    if (baseProps['width']) {
        bVars['--b-width'] = baseProps['width'];
        bVars.width = baseProps['width'];
    }
    setVar('--b-height', baseProps['height']);
    setVar('--b-gap', baseProps['gap']);
    setVar('--b-justify-content', baseProps['justify-content']);
    setVar('--b-flex-direction', baseProps['flex-direction']);
    setVar('--b-align-items', baseProps['align-items']);
    setVar('--b-flex-wrap', baseProps['flex-wrap']);
    setVar('--b-border-width', baseProps['border-width']);
    setVar('--b-border-style', baseProps['border-style']);
    setVar('--b-border-color', baseProps['border-color']);
    setVar('--b-bg-position', baseProps['bg-position']);
    setVar('--b-bg-repeat', baseProps['bg-repeat']);
    setVar('--b-bg-size', baseProps['bg-size']);
    setVar('--b-box-shadow', baseProps['box-shadow']);
    setVar('--b-transition', baseProps['transition']);

    // Background image + overlay (replaces JS gradient composition)
    if (baseProps['bg-image']) {
        setVar('--b-bg-image', `url(${baseProps['bg-image']})`);
        if (baseProps['overlay-color']) {
            setVar('--b-bg-overlay', baseProps['overlay-color']);
        }
        if (baseProps['overlay-opacity'] !== undefined && baseProps['overlay-opacity'] !== 0) {
            setVar('--b-bg-opacity', baseProps['overlay-opacity']);
        }
    }

    // Interaction state CSS variables (renamed to match --b-* convention)
    if (isLayout) {
        setVar('--b-hover-layout-bg-color', baseProps['hover-bg-color']);
        setVar('--b-active-layout-bg-color', baseProps['active-bg-color']);
        setVar('--b-focus-layout-bg-color', baseProps['focus-bg-color']);
    } else {
        setVar('--b-hover-bg-color', baseProps['hover-bg-color']);
        setVar('--b-active-bg-color', baseProps['active-bg-color']);
        setVar('--b-focus-bg-color', baseProps['focus-bg-color']);
    }
    setVar('--b-hover-color', baseProps['hover-color']);
    setVar('--b-hover-border-color', baseProps['hover-border-color']);

    // Hover/active/focus font-size, font-weight, font-style
    setVar('--b-hover-font-size', baseProps['hover-font-size']);
    setVar('--b-hover-font-weight', baseProps['hover-font-weight']);
    setVar('--b-hover-font-style', baseProps['hover-font-style']);
    setVar('--b-hover-text-decoration', baseProps['hover-text-decoration']);
    setVar('--b-active-font-size', baseProps['active-font-size']);
    setVar('--b-active-font-weight', baseProps['active-font-weight']);
    setVar('--b-focus-font-size', baseProps['focus-font-size']);
    setVar('--b-focus-font-weight', baseProps['focus-font-weight']);

    // Map tablet properties
    setVar('--b-tablet-color', tProps['color']);
    setVar('--b-tablet-font-size', tProps['font-size']);
    setVar('--b-tablet-font-weight', tProps['font-weight']);
    setVar('--b-tablet-font-style', tProps['font-style']);
    setVar('--b-tablet-text-decoration', tProps['text-decoration']);
    setVar('--b-tablet-padding', tProps['padding']);
    setVar('--b-tablet-margin', tProps['margin']);
    setVar('--b-tablet-width', tProps['width']);
    setVar('--b-tablet-height', tProps['height']);
    setVar('--b-tablet-gap', tProps['gap']);
    setVar('--b-tablet-border-width', tProps['border-width']);
    setVar('--b-tablet-border-color', tProps['border-color']);
    setVar('--b-tablet-border-radius', tProps['border-radius']);
    setVar('--b-tablet-box-shadow', tProps['box-shadow']);
    setVar('--b-tablet-transition', tProps['transition']);
    setVar('--b-tablet-bg-color', tProps['bg-color']);
    setVar('--b-tablet-justify-content', tProps['justify-content']);
    setVar('--b-tablet-flex-direction', tProps['flex-direction']);
    setVar('--b-tablet-align-items', tProps['align-items']);
    setVar('--b-tablet-flex-wrap', tProps['flex-wrap']);
    setVar('--b-tablet-text-align', tProps['text-align']);

    // Map mobile properties
    setVar('--b-mobile-color', mProps['color']);
    setVar('--b-mobile-font-size', mProps['font-size']);
    setVar('--b-mobile-font-weight', mProps['font-weight']);
    setVar('--b-mobile-font-style', mProps['font-style']);
    setVar('--b-mobile-text-decoration', mProps['text-decoration']);
    setVar('--b-mobile-padding', mProps['padding']);
    setVar('--b-mobile-margin', mProps['margin']);
    setVar('--b-mobile-width', mProps['width']);
    setVar('--b-mobile-height', mProps['height']);
    setVar('--b-mobile-gap', mProps['gap']);
    setVar('--b-mobile-border-width', mProps['border-width']);
    setVar('--b-mobile-border-color', mProps['border-color']);
    setVar('--b-mobile-border-radius', mProps['border-radius']);
    setVar('--b-mobile-box-shadow', mProps['box-shadow']);
    setVar('--b-mobile-transition', mProps['transition']);
    setVar('--b-mobile-bg-color', mProps['bg-color']);
    setVar('--b-mobile-justify-content', mProps['justify-content']);
    setVar('--b-mobile-flex-direction', mProps['flex-direction']);
    setVar('--b-mobile-align-items', mProps['align-items']);
    setVar('--b-mobile-flex-wrap', mProps['flex-wrap']);
    setVar('--b-mobile-text-align', mProps['text-align']);

    // For cms-col elements, override flex:1 behavior so width works
    if (baseProps['width'] && baseProps.className && baseProps.className.includes('cms-col')) {
        bVars.flex = '0 0 auto';
    }

    const hoverClass = [
        baseProps['hover-bg-color'] ? 'has-hover-bg' : '',
        baseProps['hover-color'] ? 'has-hover-color' : '',
        baseProps['hover-border-color'] ? 'has-hover-border' : '',
        baseProps['active-bg-color'] ? 'has-active-bg' : '',
        baseProps['hover-scale'] === 'zoom' ? 'hover-zoom' : ''
    ].filter(Boolean).join(' ');

    const visibilityClass = [
        baseProps.hideDesktop ? 'd-none-desktop' : '',
        baseProps.hideTablet ? 'd-none-tablet' : '',
        baseProps.hideMobile ? 'd-none-mobile' : ''
    ].filter(Boolean).join(' ');

    const blockClass = `${isLayout ? 'seczone-layout' : 'seczone-block'} ${hoverClass} ${visibilityClass} ${baseProps.className || ''}`.trim();

    let Tag = block.tag || 'div';
    let displayContent = block.content;

    // Smart Tag Detection for legacy/content
    if (!block.tag && (block.block_type === 'text' || block.block_type === 'richtext') && block.content) {
        const match = block.content.trim().match(/^<([a-z1-6]+|a)(?:\s+[^>]*)?>(.*)<\/\1>$/is);
        if (match) {
            Tag = match[1].toLowerCase();
            displayContent = match[2];
        }
    }

    switch (block.block_type) {
        case 'text':
        case 'richtext':
            return (
                <Tag
                    className={blockClass}
                    style={bVars}
                    href={Tag === 'a' ? (baseProps.href || '#') : undefined}
                    target={Tag === 'a' ? baseProps.target : undefined}
                    rel={Tag === 'a' && baseProps.target === '_blank' ? 'noopener noreferrer' : undefined}
                    title={Tag === 'a' ? baseProps.title : undefined}
                    aria-label={Tag === 'a' ? baseProps['aria-label'] : undefined}
                    dangerouslySetInnerHTML={{ __html: displayContent }}
                />
            );
        case 'button':
            const btnAlign = (bVars['--b-text-align'] || '') === 'left' ? 'align-left' : (bVars['--b-text-align'] || '') === 'right' ? 'align-right' : 'align-center';
            const buttonStyleVal = baseProps['button-style'] || '';
            const buttonVariantClass = [
                baseProps['button-variant'] || '',
                tProps['button-variant'] ? `tablet-${tProps['button-variant']}` : '',
                mProps['button-variant'] ? `mobile-${mProps['button-variant']}` : ''
            ].filter(Boolean).join(' ');
            
            const buttonSizeClass = [
                baseProps['button-size'] || '',
                tProps['button-size'] ? `tablet-${tProps['button-size']}` : '',
                mProps['button-size'] ? `mobile-${mProps['button-size']}` : ''
            ].filter(Boolean).join(' ');

            const { iconLeft, iconRight, iconGap = '0px' } = baseProps;

            const btnDynamicStyle = { ...bVars };

            // Map explicit override colors to CSS variables for the cascade
            if (baseProps['bg-color']) btnDynamicStyle['--btn-bg'] = baseProps['bg-color'];
            if (baseProps['color']) btnDynamicStyle['--btn-color'] = baseProps['color'];
            if (baseProps['border-radius']) btnDynamicStyle['--btn-border-radius'] = baseProps['border-radius'];
            
            // Map hover/active colors to CSS variables for the cascade
            if (baseProps['hover-bg-color']) {
                btnDynamicStyle['--btn-hover-bg'] = baseProps['hover-bg-color'];
            }
            if (baseProps['hover-color']) {
                btnDynamicStyle['--btn-hover-color'] = baseProps['hover-color'];
            }
            if (baseProps['active-bg-color']) {
                btnDynamicStyle['--btn-active-bg'] = baseProps['active-bg-color'];
            }

            // Also output responsive button variables for live CSS cascade
            if (tProps['hover-bg-color']) btnDynamicStyle['--btn-hover-bg'] = tProps['hover-bg-color'];
            if (tProps['hover-color']) btnDynamicStyle['--btn-hover-color'] = tProps['hover-color'];
            if (tProps['active-bg-color']) btnDynamicStyle['--btn-active-bg'] = tProps['active-bg-color'];
            if (tProps['border-radius']) btnDynamicStyle['--btn-tablet-border-radius'] = tProps['border-radius'];

            if (mProps['hover-bg-color']) btnDynamicStyle['--btn-hover-bg'] = mProps['hover-bg-color'];
            if (mProps['hover-color']) btnDynamicStyle['--btn-hover-color'] = mProps['hover-color'];
            if (mProps['active-bg-color']) btnDynamicStyle['--btn-active-bg'] = mProps['active-bg-color'];
            if (mProps['border-radius']) btnDynamicStyle['--btn-mobile-border-radius'] = mProps['border-radius'];

            const buttonStyleClass = buttonStyleVal;

            const btnClass = `button ${blockClass} ${btnAlign} ${buttonStyleClass} ${buttonVariantClass} ${buttonSizeClass}`.trim();

            const ButtonTag = baseProps.href ? 'a' : 'button';
            const buttonProps = baseProps.href ? {
                href: baseProps.href,
                target: baseProps.target,
                rel: baseProps.target === '_blank' ? 'noopener noreferrer' : undefined,
                title: baseProps.title,
                'aria-label': baseProps['aria-label']
            } : {
                type: baseProps.type || 'button'
            };

            return (
                <ButtonTag className={btnClass} style={btnDynamicStyle} {...buttonProps}>
                    {iconLeft && <Icon icon={icons[iconLeft]} style={{ marginRight: iconGap }} />}
                    <span>{block.content}</span>
                    {iconRight && <Icon icon={icons[iconRight]} style={{ marginLeft: iconGap }} />}
                </ButtonTag>
            );
        case 'image':
            const imgClass = `${blockClass} seczone-image`.trim();
            const imgSrc = (baseProps.src && baseProps.src !== '/defaults/no-image.webp') 
                ? baseProps.src 
                : (baseProps['bg-image'] || baseProps.src || '/defaults/no-image.webp');
            return (
                <div className={imgClass} style={bVars}>
                    <img src={imgSrc} alt={baseProps.alt || ''} style={{objectFit: bVars['--b-object-fit'] || 'cover'}} />
                </div>
            );
        case 'video':
            const videoClass = `${blockClass} seczone-video`.trim();
            return (
                <div className={videoClass} style={bVars}>
                    <video
                        src={baseProps.src || ''}
                        controls={baseProps.controls !== false}
                        autoPlay={!!baseProps.autoplay}
                        loop={!!baseProps.loop}
                        muted={!!baseProps.muted}
                        poster={baseProps.poster || undefined}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        case 'container':
            return (
                <div className={blockClass} style={bVars}>
                    {blocks?.map((subBlock, idx) => (
                        <CmsBlockRenderer 
                            key={`${parentPath}-${idx}`} 
                            block={subBlock} 
                            sectionId={sectionId} 
                            parentPath={`${parentPath}-${idx}`} 
                        />
                    ))}
                </div>
            );
        case 'icon':
            const IconTag = baseProps.href ? 'a' : 'div';
            const iconWrapClass = `${blockClass} seczone-icon ${baseProps['hover-scale'] === 'zoom' ? 'hover-zoom' : ''} ${baseProps['hover-bg-color'] ? 'has-hover-bg' : ''} ${baseProps['hover-color'] ? 'has-hover-color' : ''} ${baseProps['active-bg-color'] ? 'has-active-bg' : ''}`.trim();
            const iconDynamicStyle = { ...bVars };
            if (baseProps.color) iconDynamicStyle['--b-color'] = baseProps.color;

            const iconLinkProps = baseProps.href ? {
                href: baseProps.href,
                target: baseProps.target,
                rel: baseProps.target === '_blank' ? 'noopener noreferrer' : undefined,
                title: baseProps.title,
                'aria-label': baseProps['aria-label']
            } : {};

            return (
                <IconTag className={iconWrapClass} style={iconDynamicStyle} {...iconLinkProps}>
                    <Icon 
                        icon={icons[baseProps.icon || 'info']} 
                        size={baseProps.size || 24} 
                    />
                </IconTag>
            );
        default:
            return (
                <div
                    className={blockClass}
                    style={bVars}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                />
            );
    }
};

export default CmsBlockRenderer;