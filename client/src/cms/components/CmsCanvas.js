import React, { useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import CmsCanvasToolbar from './CmsCanvasToolbar';
import CmsSection from './CmsSection';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';

const CmsCanvas = () => {
    const { loading, setSelectedElement, view, pageData, selectedElement, updateBlockContent, updateBlockProperty, getElementByPath, footerData, headerData, updateSectionSetting, activeStyleState, navigations, updateNavigationProperty } = useCMS();

    const headerRef = useRef(null);
    const footerRef = useRef(null);

    const [openDropdownId, setOpenDropdownId] = React.useState(null);

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (!document.contains(e.target)) return;
            if (
                openDropdownId !== null && 
                !e.target.closest('.web-navbar-item') &&
                !e.target.closest('.cms-props') &&
                !e.target.closest('.cms-sidebar') &&
                !e.target.closest('.cms-header') &&
                !e.target.closest('[class*="toolbar"]') &&
                !e.target.closest('.popup-menu-container') &&
                !e.target.closest('.popup-toolbar-btn')
            ) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openDropdownId]);

    // --- Block Resize Logic ---
    const handleBlockResizeStart = (e, hDir, vDir, sectionId, currentPath, isNav = false) => {
        e.stopPropagation();
        e.preventDefault();

        const blockElement = e.target.parentElement;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = blockElement.offsetWidth;
        const startHeight = blockElement.offsetHeight;

        const originalTransition = blockElement.style.transition;
        blockElement.style.transition = 'none';

        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            if (hDir) {
                const newWidth = Math.max(20, hDir === 'right' ? startWidth + deltaX : startWidth - deltaX);
                blockElement.style.width = `${newWidth}px`;
            }
            if (vDir) {
                const newHeight = Math.max(10, vDir === 'bottom' ? startHeight + deltaY : startHeight - deltaY);
                blockElement.style.height = `${newHeight}px`;
            }
        };

        const handleMouseUp = (upEvent) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            blockElement.style.transition = originalTransition;

            const deltaX = upEvent.clientX - startX;
            const deltaY = upEvent.clientY - startY;

            if (hDir) {
                const newWidth = Math.max(20, hDir === 'right' ? startWidth + deltaX : startWidth - deltaX);
                if (isNav) {
                    updateNavigationProperty(currentPath, 'width', `${newWidth}px`);
                } else if (currentPath === 'logo') {
                    updateSectionSetting(sectionId, 'logoSettings', (prev) => ({ ...(prev || {}), width: `${newWidth}px` }));
                } else {
                    updateBlockProperty(sectionId, currentPath, 'width', `${newWidth}px`);
                }
            }
            if (vDir) {
                const newHeight = Math.max(10, vDir === 'bottom' ? startHeight + deltaY : startHeight - deltaY);
                if (isNav) {
                    updateNavigationProperty(currentPath, 'height', `${newHeight}px`);
                } else if (currentPath === 'logo') {
                    updateSectionSetting(sectionId, 'logoSettings', (prev) => ({ ...(prev || {}), height: `${newHeight}px` }));
                } else {
                    updateBlockProperty(sectionId, currentPath, 'height', `${newHeight}px`);
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleSectionResizeStart = (e, sectionId, ref) => {
        if (!ref.current) return;
        e.stopPropagation();
        e.preventDefault();

        const startY = e.clientY;
        const startHeight = ref.current.offsetHeight;
        
        const originalTransition = ref.current.style.transition;
        ref.current.style.transition = 'none';

        const handleMouseMove = (moveEvent) => {
            const deltaY = moveEvent.clientY - startY;
            const newHeight = Math.max(40, startHeight + deltaY); // Minimum 40px height for header/footer
            ref.current.style.setProperty('--sec-height', `${newHeight}px`);
        };

        const handleMouseUp = (upEvent) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            ref.current.style.transition = originalTransition;
            
            const deltaY = upEvent.clientY - startY;
            const finalHeight = Math.max(40, startHeight + deltaY);
            updateSectionSetting(sectionId, 'height', `${finalHeight}px`);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const ResizeHandles = ({ sectionId, currentPath, isSelected, isNav = false }) => {
        if (!isSelected) return null;
        return (
            <>
                {/* 4 Edges */}
                <span className="resize-handle-top" onMouseDown={(e) => handleBlockResizeStart(e, null, 'top', sectionId, currentPath, isNav)} title="Drag to resize height from top" />
                <span className="resize-handle-bottom" onMouseDown={(e) => handleBlockResizeStart(e, null, 'bottom', sectionId, currentPath, isNav)} title="Drag to resize height from bottom" />
                <span className="resize-handle-left" onMouseDown={(e) => handleBlockResizeStart(e, 'left', null, sectionId, currentPath, isNav)} title="Drag to resize width from left" />
                <span className="resize-handle-right" onMouseDown={(e) => handleBlockResizeStart(e, 'right', null, sectionId, currentPath, isNav)} title="Drag to resize width from right" />

                {/* 4 Corners */}
                <span className="resize-handle-topLeft" onMouseDown={(e) => handleBlockResizeStart(e, 'left', 'top', sectionId, currentPath, isNav)} title="Drag to resize top-left" />
                <span className="resize-handle-topRight" onMouseDown={(e) => handleBlockResizeStart(e, 'right', 'top', sectionId, currentPath, isNav)} title="Drag to resize top-right" />
                <span className="resize-handle-bottomLeft" onMouseDown={(e) => handleBlockResizeStart(e, 'left', 'bottom', sectionId, currentPath, isNav)} title="Drag to resize bottom-left" />
                <span className="resize-handle-corner" onMouseDown={(e) => handleBlockResizeStart(e, 'right', 'bottom', sectionId, currentPath, isNav)} title="Drag to resize bottom-right" />
            </>
        );
    };

    // Helper to build CSS variables with view-based responsive merging
    const buildBlockVars = (block, viewMode, isLayout = false) => {
        const rawProps = typeof block.properties === 'string' ? (() => { try { return JSON.parse(block.properties); } catch (e) { return {}; } })() : (block.properties || {});
        const rawResponsive = typeof block.responsive === 'string' ? (() => { try { return JSON.parse(block.responsive); } catch (e) { return {}; } })() : (block.responsive || {});
        const tProps = rawResponsive?.tablet?.properties || {};
        const mProps = rawResponsive?.mobile?.properties || {};
        const bVars = {};

        const setVar = (varName, value) => {
            if (value !== undefined && value !== null && value !== '') {
                bVars[varName] = value;
            }
        };

        // Determine which viewport level to use based on editor view state
        // laptop: only base
        // tablet: base + tablet overrides
        // mobile: base + tablet + mobile overrides (cascade)
        let baseSource, tabletSource, mobileSource;
        if (viewMode === 'mobile') {
            baseSource = rawProps;
            tabletSource = tProps;
            mobileSource = mProps;
        } else if (viewMode === 'tablet') {
            baseSource = rawProps;
            tabletSource = tProps;
            mobileSource = {};
        } else {
            baseSource = rawProps;
            tabletSource = {};
            mobileSource = {};
        }

        const props = {
            ...baseSource,
            ...tabletSource,
            ...mobileSource
        };

        // Map properties to CSS variables (same naming as live renderer)
        setVar('--b-text-align', props['text-align']);
        setVar('--b-color', props['color']);
        setVar('--b-font-size', props['font-size']);
        setVar('--b-font-weight', props['font-weight']);
        setVar('--b-font-style', props['font-style']);
        setVar('--b-text-decoration', props['text-decoration']);
        setVar('--b-margin-bottom', props['margin-bottom']);
        setVar('--b-margin-top', props['margin-top']);
        setVar('--b-margin', props['margin']);
        setVar('--b-padding', props['padding']);
        setVar('--b-border-radius', props['border-radius']);
        // Use layout-specific variable for containers to prevent CSS cascade to children
        if (isLayout) {
            setVar('--b-layout-bg-color', props['bg-color']);
        } else {
            setVar('--b-bg-color', props['bg-color']);
        }
        if (props['width']) {
            setVar('--b-width', props['width']);
            bVars.width = props['width'];
        }
        setVar('--b-height', props['height']);
        setVar('--b-gap', props['gap']);
        setVar('--b-justify-content', props['justify-content']);
        setVar('--b-flex-direction', props['flex-direction']);
        setVar('--b-align-items', props['align-items']);
        setVar('--b-flex-wrap', props['flex-wrap']);
        setVar('--b-border-width', props['border-width']);
        setVar('--b-border-style', props['border-style']);
        setVar('--b-border-color', props['border-color']);
        setVar('--b-bg-position', props['bg-position']);
        setVar('--b-bg-repeat', props['bg-repeat']);
        setVar('--b-bg-size', props['bg-size']);
        setVar('--b-box-shadow', props['box-shadow']);
        setVar('--b-transition', props['transition']);

        // Background image + overlay
        const bgImage = props['bg-image'] || baseSource['bg-image'];
        if (bgImage) {
            setVar('--b-bg-image', `url(${bgImage})`);
        }
        const overlayColor = props['overlay-color'] || baseSource['overlay-color'];
        const overlayOpacity = props['overlay-opacity'] !== undefined ? props['overlay-opacity'] : baseSource['overlay-opacity'];
        if (overlayColor) setVar('--b-bg-overlay', overlayColor);
        if (overlayOpacity !== undefined && overlayOpacity !== 0) setVar('--b-bg-opacity', overlayOpacity);

        // Interaction state CSS variables
        if (isLayout) {
            setVar('--b-hover-layout-bg-color', baseSource['hover-bg-color']);
            setVar('--b-active-layout-bg-color', baseSource['active-bg-color']);
            setVar('--b-focus-layout-bg-color', baseSource['focus-bg-color']);
        } else {
            setVar('--b-hover-bg-color', baseSource['hover-bg-color']);
            setVar('--b-active-bg-color', baseSource['active-bg-color']);
            setVar('--b-focus-bg-color', baseSource['focus-bg-color']);
        }
        setVar('--b-hover-color', baseSource['hover-color']);
        setVar('--b-hover-border-color', baseSource['hover-border-color']);
        setVar('--b-hover-font-size', baseSource['hover-font-size']);
        setVar('--b-hover-font-weight', baseSource['hover-font-weight']);
        setVar('--b-hover-font-style', baseSource['hover-font-style']);
        setVar('--b-hover-text-decoration', baseSource['hover-text-decoration']);
        setVar('--b-active-font-size', baseSource['active-font-size']);
        setVar('--b-active-font-weight', baseSource['active-font-weight']);
        setVar('--b-focus-font-size', baseSource['focus-font-size']);
        setVar('--b-focus-font-weight', baseSource['focus-font-weight']);

        // Also output viewport-specific variables for the cascade to work in editor iframe
        // These provide fallback chain: mobile → tablet → base
        if (viewMode === 'tablet' || viewMode === 'mobile') {
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
            if (isLayout) {
                setVar('--b-tablet-layout-bg-color', tProps['bg-color']);
            } else {
                setVar('--b-tablet-bg-color', tProps['bg-color']);
            }
            setVar('--b-tablet-justify-content', tProps['justify-content']);
            setVar('--b-tablet-flex-direction', tProps['flex-direction']);
            setVar('--b-tablet-align-items', tProps['align-items']);
            setVar('--b-tablet-flex-wrap', tProps['flex-wrap']);
            setVar('--b-tablet-text-align', tProps['text-align']);
            setVar('--b-tablet-border-width', tProps['border-width']);
            setVar('--b-tablet-border-color', tProps['border-color']);
            setVar('--b-tablet-border-radius', tProps['border-radius']);
            setVar('--b-tablet-box-shadow', tProps['box-shadow']);
            setVar('--b-tablet-transition', tProps['transition']);
        }
        if (viewMode === 'mobile') {
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
            if (isLayout) {
                setVar('--b-mobile-layout-bg-color', mProps['bg-color']);
            } else {
                setVar('--b-mobile-bg-color', mProps['bg-color']);
            }
            setVar('--b-mobile-justify-content', mProps['justify-content']);
            setVar('--b-mobile-flex-direction', mProps['flex-direction']);
            setVar('--b-mobile-align-items', mProps['align-items']);
            setVar('--b-mobile-flex-wrap', mProps['flex-wrap']);
            setVar('--b-mobile-text-align', mProps['text-align']);
            setVar('--b-mobile-border-width', mProps['border-width']);
            setVar('--b-mobile-border-color', mProps['border-color']);
            setVar('--b-mobile-border-radius', mProps['border-radius']);
            setVar('--b-mobile-box-shadow', mProps['box-shadow']);
            setVar('--b-mobile-transition', mProps['transition']);
        }

        // Column flex fix
        if (baseSource['width'] && baseSource.className && baseSource.className.includes('cms-col')) {
            bVars['--b-width'] = baseSource['width'];
            bVars.flex = '0 0 auto';
        }

        return { bVars, rawProps: baseSource, rawResponsive };
    };

    const renderBlocks = (blocks, sectionId, parentPath = '') => {
        if (!blocks || blocks.length === 0) {
            return (<div className='cms-empty-container'>Empty Container</div>);
        }

        return blocks.map((block, idx) => {
            const pathIdx = block._pathIdx !== undefined ? block._pathIdx : idx;
            const currentPath = parentPath === '' ? `${pathIdx}` : `${parentPath}-${pathIdx}`;
            const isLayout = block.block_type === 'container';
            const { bVars, rawProps, rawResponsive } = buildBlockVars(block, view, isLayout);

            const hoverClass = [
                rawProps['hover-bg-color'] ? 'has-hover-bg' : '',
                rawProps['hover-color'] ? 'has-hover-color' : '',
                rawProps['hover-border-color'] ? 'has-hover-border' : '',
                rawProps['active-bg-color'] ? 'has-active-bg' : '',
                rawProps['hover-scale'] === 'zoom' ? 'hover-zoom' : ''
            ].filter(Boolean).join(' ');

            const isSelected = selectedElement.sectionId === sectionId && selectedElement.id === currentPath;
            const stateSimClass = isSelected && activeStyleState !== 'normal' ? `cms-simulate-${activeStyleState}` : '';
            const visibilityClass = [
                rawProps.hideDesktop ? 'd-none-desktop' : '',
                rawProps.hideTablet ? 'd-none-tablet' : '',
                rawProps.hideMobile ? 'd-none-mobile' : ''
            ].filter(Boolean).join(' ');
            const blockClass = `${isLayout ? 'seczone-layout' : 'seczone-block'} ${hoverClass} ${stateSimClass} ${visibilityClass} ${rawProps.className || ''}`.trim();

            let Tag = block.tag || 'div';
            let displayContent = block.content;

            // Smart Tag Detection for legacy
            if (!block.tag && (block.block_type === 'text' || block.block_type === 'richtext') && block.content) {
                const match = block.content.trim().match(/^<([a-z1-6]+|a)(?:\s+[^>]*)?>(.*)<\/\1>$/is);
                if (match) {
                    Tag = match[1].toLowerCase();
                    displayContent = match[2];
                }
            }

            const handleClick = (e) => {
                e.stopPropagation();

                setSelectedElement({
                    type: block.block_type,
                    id: currentPath,
                    sectionId: sectionId,
                    data: block
                });
            };

            const handleDoubleClick = (e) => {
                e.stopPropagation();
                if (parentPath !== '') {
                    const parentData = getElementByPath(sectionId, parentPath);
                    if (parentData) {
                        setSelectedElement({
                            type: parentData.block_type || 'container',
                            id: parentPath,
                            sectionId: sectionId,
                            data: parentData
                        });
                    }
                }
            };

            switch (block.block_type) {
                case 'text':
                case 'richtext':
                    return (
                        <Tag
                            key={currentPath}
                            className={blockClass}
                            data-cms-active={isSelected ? "true" : undefined}
                            style={bVars}
                            href={Tag === 'a' ? (rawProps.href || '#') : undefined}
                            target={Tag === 'a' ? rawProps.target : undefined}
                            rel={Tag === 'a' && rawProps.target === '_blank' ? 'noopener noreferrer' : undefined}
                            title={Tag === 'a' ? rawProps.title : undefined}
                            aria-label={Tag === 'a' ? rawProps['aria-label'] : undefined}
                            onClick={(e) => {
                                if (Tag === 'a') e.preventDefault();
                                handleClick(e);
                            }}
                            onDoubleClick={handleDoubleClick}
                        >
                            <span
                                style={{ outline: 'none', display: 'block', width: '100%', minHeight: '100%' }}
                                contentEditable={isSelected}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                    const newContent = e.target.innerHTML;
                                    if (newContent !== displayContent) {
                                        if (!block.tag && Tag) updateBlockProperty(sectionId, currentPath, 'tag', Tag);
                                        updateBlockContent(sectionId, currentPath, newContent);
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: displayContent }}
                            />
                            <ResizeHandles sectionId={sectionId} currentPath={currentPath} isSelected={isSelected} />
                        </Tag>
                    );
                case 'button':
                    const tProps = rawResponsive?.tablet?.properties || {};
                    const mProps = rawResponsive?.mobile?.properties || {};

                    const btnAlign = (bVars['--b-text-align'] || '') === 'left' ? 'align-left' : (bVars['--b-text-align'] || '') === 'right' ? 'align-right' : 'align-center';
                    const buttonStyleVal = rawProps['button-style'] || '';
                    const buttonVariantClass = [
                        rawProps['button-variant'] || '',
                        tProps['button-variant'] ? `tablet-${tProps['button-variant']}` : '',
                        mProps['button-variant'] ? `mobile-${mProps['button-variant']}` : ''
                    ].filter(Boolean).join(' ');
                    const buttonSizeClass = [
                        rawProps['button-size'] || '',
                        tProps['button-size'] ? `tablet-${tProps['button-size']}` : '',
                        mProps['button-size'] ? `mobile-${mProps['button-size']}` : ''
                    ].filter(Boolean).join(' ');

                    const { iconLeft, iconRight, iconGap = '0px' } = rawProps;

                    const btnDynamicStyle = { ...bVars };

                    // Map explicit override colors to CSS variables for the cascade
                    if (rawProps['bg-color']) btnDynamicStyle['--btn-bg'] = rawProps['bg-color'];
                    if (rawProps['color']) btnDynamicStyle['--btn-color'] = rawProps['color'];
                    if (rawProps['border-radius']) btnDynamicStyle['--btn-border-radius'] = rawProps['border-radius'];

                    // Map hover/active colors to CSS variables for the cascade
                    if (rawProps['hover-bg-color']) {
                        btnDynamicStyle['--btn-hover-bg'] = rawProps['hover-bg-color'];
                    }
                    if (rawProps['hover-color']) {
                        btnDynamicStyle['--btn-hover-color'] = rawProps['hover-color'];
                    }
                    if (rawProps['active-bg-color']) {
                        btnDynamicStyle['--btn-active-bg'] = rawProps['active-bg-color'];
                    }

                    // Output responsive button variables for the cascade
                    if (view === 'tablet' || view === 'mobile') {
                        if (view === 'tablet' || view === 'mobile') {
                            if (tProps['hover-bg-color']) btnDynamicStyle['--btn-hover-bg'] = tProps['hover-bg-color'];
                            if (tProps['hover-color']) btnDynamicStyle['--btn-hover-color'] = tProps['hover-color'];
                            if (tProps['active-bg-color']) btnDynamicStyle['--btn-active-bg'] = tProps['active-bg-color'];
                            if (tProps['border-radius']) btnDynamicStyle['--btn-tablet-border-radius'] = tProps['border-radius'];
                        }
                        if (view === 'mobile') {
                            if (mProps['hover-bg-color']) btnDynamicStyle['--btn-hover-bg'] = mProps['hover-bg-color'];
                            if (mProps['hover-color']) btnDynamicStyle['--btn-hover-color'] = mProps['hover-color'];
                            if (mProps['active-bg-color']) btnDynamicStyle['--btn-active-bg'] = mProps['active-bg-color'];
                            if (mProps['border-radius']) btnDynamicStyle['--btn-mobile-border-radius'] = mProps['border-radius'];
                        }
                    }

                    const buttonStyleClass = buttonStyleVal;

                    const btnClass = `button ${blockClass} ${btnAlign} ${buttonStyleClass} ${buttonVariantClass} ${buttonSizeClass}`.trim();

                    const ButtonTag = rawProps.href ? 'a' : 'button';
                    const buttonProps = rawProps.href ? {
                        href: rawProps.href,
                        target: rawProps.target,
                        rel: rawProps.target === '_blank' ? 'noopener noreferrer' : undefined,
                        title: rawProps.title,
                        'aria-label': rawProps['aria-label']
                    } : {
                        type: rawProps.type || 'button'
                    };

                    return (
                        <ButtonTag
                            key={currentPath}
                            className={btnClass}
                            data-cms-active={isSelected ? "true" : undefined}
                            style={btnDynamicStyle}
                            onClick={(e) => {
                                e.preventDefault();
                                handleClick(e);
                            }}
                            onDoubleClick={handleDoubleClick}
                            {...buttonProps}
                        >
                            {iconLeft && <Icon icon={icons[iconLeft]} style={{ marginRight: iconGap }} />}

                            <span contentEditable={isSelected} suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                    const newContent = e.target.innerText;
                                    if (newContent !== block.content) {
                                        updateBlockContent(sectionId, currentPath, newContent);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        e.target.blur();
                                    }
                                }}
                            >
                                {block.content}
                            </span>

                            {iconRight && <Icon icon={icons[iconRight]} style={{ marginLeft: iconGap }} />}
                            <ResizeHandles sectionId={sectionId} currentPath={currentPath} isSelected={isSelected} />
                        </ButtonTag>
                    );
                case 'image':
                    const imgClass = `${blockClass} seczone-image`.trim();
                    const imgSrc = (rawProps.src && rawProps.src !== '/defaults/no-image.webp')
                        ? rawProps.src
                        : (rawProps['bg-image'] || rawProps.src || '/defaults/no-image.webp');
                    return (
                        <div key={currentPath} className={imgClass} data-cms-active={isSelected ? "true" : undefined} style={bVars} onClick={handleClick} onDoubleClick={handleDoubleClick}>
                            <img src={imgSrc} alt="" style={{ objectFit: bVars['--b-object-fit'] || 'cover' }} />
                            <ResizeHandles sectionId={sectionId} currentPath={currentPath} isSelected={isSelected} />
                        </div>
                    );
                case 'video':
                    const videoClass = `${blockClass} seczone-video`.trim();
                    return (
                        <div key={currentPath} className={videoClass} data-cms-active={isSelected ? "true" : undefined} style={bVars} onClick={handleClick} onDoubleClick={handleDoubleClick}>
                            <video
                                src={rawProps.src || ''}
                                controls={rawProps.controls !== false}
                                autoPlay={!!rawProps.autoplay}
                                loop={!!rawProps.loop}
                                muted={!!rawProps.muted}
                                poster={rawProps.poster || undefined}
                            >
                                Your browser does not support the video tag.
                            </video>
                            <ResizeHandles sectionId={sectionId} currentPath={currentPath} isSelected={isSelected} />
                        </div>
                    );
                case 'container':
                    return (
                        <div
                            key={currentPath}
                            className={blockClass}
                            data-cms-active={isSelected ? "true" : undefined}
                            style={bVars}
                            onClick={handleClick}
                            onDoubleClick={handleDoubleClick}
                        >
                            {renderBlocks(block.blocks, sectionId, currentPath)}
                            <ResizeHandles sectionId={sectionId} currentPath={currentPath} isSelected={isSelected} />
                        </div>
                    );
                case 'icon':
                    const IconTag = rawProps.href ? 'a' : 'div';
                    const iconClass = `${blockClass} seczone-icon ${rawProps['hover-scale'] === 'zoom' ? 'hover-zoom' : ''} ${rawProps['hover-bg-color'] ? 'has-hover-bg' : ''} ${rawProps['hover-color'] ? 'has-hover-color' : ''} ${rawProps['active-bg-color'] ? 'has-active-bg' : ''}`.trim();
                    const iconDynamicStyle = { ...bVars };
                    if (rawProps.color) iconDynamicStyle['--b-color'] = rawProps.color;

                    const iconLinkProps = rawProps.href ? {
                        href: rawProps.href,
                        target: rawProps.target,
                        rel: rawProps.target === '_blank' ? 'noopener noreferrer' : undefined,
                        title: rawProps.title,
                        'aria-label': rawProps['aria-label']
                    } : {};

                    return (
                        <IconTag
                            key={currentPath}
                            className={iconClass}
                            data-cms-active={isSelected ? "true" : undefined}
                            style={iconDynamicStyle}
                            onClick={(e) => {
                                if (rawProps.href) e.preventDefault();
                                handleClick(e);
                            }}
                            onDoubleClick={handleDoubleClick}
                            {...iconLinkProps}
                        >
                            <Icon
                                icon={icons[rawProps.icon || 'info']}
                                size={rawProps.size || 24}
                            />
                            <ResizeHandles sectionId={sectionId} currentPath={currentPath} isSelected={isSelected} />
                        </IconTag>
                    );
                default:
                    return (
                        <div
                            key={currentPath}
                            className={blockClass}
                            data-cms-active={isSelected ? "true" : undefined}
                            style={bVars}
                            dangerouslySetInnerHTML={{ __html: block.content }}
                            onClick={handleClick}
                            onDoubleClick={handleDoubleClick}
                        />
                    );
            }
        });
    };

    const renderSection = (section) => {
        return <CmsSection key={section.id} section={section} renderBlocks={renderBlocks} />;
    };

    const renderHeaderSection = () => {
        if (!headerData) return null;

        const s = headerData.settings || {};
        const t = s.responsive?.tablet || {};
        const m = s.responsive?.mobile || {};
        const style = {};

        const setVar = (varName, value) => {
            if (value !== undefined && value !== null && value !== '') {
                style[varName] = value;
            }
        };

        // Map header settings to styles matching CmsSection
        setVar('--sec-bg-color', s.bgColor);
        if (s.bgImage) style['--sec-bg-image'] = `url(${s.bgImage})`;
        setVar('--sec-padding', s.padding);
        setVar('--sec-margin', s.margin);
        setVar('--sec-color', s.color);
        setVar('--sec-font-size', s.fontSize);
        setVar('--sec-font-weight', s.fontWeight);
        if (s.boxShadow) style.boxShadow = s.boxShadow;

        // Background advanced settings
        setVar('--sec-bg-position', s.bgPosition);
        setVar('--sec-bg-repeat', s.bgRepeat);
        setVar('--sec-bg-size', s.bgSize);

        // Overlay
        setVar('--sec-overlay-color', s.overlayColor);
        if (s.overlayOpacity !== undefined && s.overlayOpacity !== 0) style['--sec-overlay-opacity'] = s.overlayOpacity;

        // Border
        setVar('--sec-border-width', s.borderWidth);
        setVar('--sec-border-style', s.borderStyle);
        setVar('--sec-border-color', s.borderColor);
        setVar('--sec-border-radius', s.borderRadius);

        // Interaction states
        setVar('--s-hover-bg-color', s.hoverBgColor);
        setVar('--s-hover-color', s.hoverColor);
        setVar('--s-hover-border-color', s.hoverBorderColor);
        setVar('--s-active-bg-color', s.activeBgColor);

        // Responsive inline overrides based on the current view mode
        if (view === 'tablet') {
            setVar('--sec-bg-color', t.bgColor);
            if (t.bgImage) style['--sec-bg-image'] = `url(${t.bgImage})`;
            setVar('--sec-padding', t.padding);
            setVar('--sec-margin', t.margin);
            setVar('--sec-font-size', t.fontSize);
            setVar('--sec-font-weight', t.fontWeight);
            setVar('--sec-color', t.color);
            setVar('--sec-border-width', t.borderWidth);
            setVar('--sec-border-color', t.borderColor);
            setVar('--sec-border-radius', t.borderRadius);
            if (t.boxShadow) style.boxShadow = t.boxShadow;
            setVar('--sec-overlay-color', t.overlayColor);
            if (t.overlayOpacity !== undefined && t.overlayOpacity !== 0) style['--sec-overlay-opacity'] = t.overlayOpacity;
        } else if (view === 'mobile') {
            setVar('--sec-bg-color', m.bgColor || t.bgColor);
            if (m.bgImage || t.bgImage) style['--sec-bg-image'] = `url(${m.bgImage || t.bgImage})`;
            setVar('--sec-padding', m.padding || t.padding);
            setVar('--sec-margin', m.margin || t.margin);
            setVar('--sec-font-size', m.fontSize || t.fontSize);
            setVar('--sec-font-weight', m.fontWeight || t.fontWeight);
            setVar('--sec-color', m.color || t.color);
            setVar('--sec-border-width', m.borderWidth || t.borderWidth);
            setVar('--sec-border-color', m.borderColor || t.borderColor);
            setVar('--sec-border-radius', m.borderRadius || t.borderRadius);
            if (m.boxShadow || t.boxShadow) style.boxShadow = m.boxShadow || t.boxShadow;
            setVar('--sec-overlay-color', m.overlayColor || t.overlayColor);
            if ((m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity) !== undefined && 
                (m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity) !== 0) {
                style['--sec-overlay-opacity'] = m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity;
            }
        }

        // Output viewport-specific responsive variables for the CSS cascade
        setVar('--s-tablet-bg-color', t.bgColor);
        setVar('--s-tablet-padding', t.padding);
        setVar('--s-tablet-margin', t.margin);
        setVar('--s-tablet-font-size', t.fontSize);
        setVar('--s-tablet-font-weight', t.fontWeight);
        setVar('--s-tablet-color', t.color);
        setVar('--s-tablet-border-width', t.borderWidth);
        setVar('--s-tablet-border-color', t.borderColor);
        setVar('--s-tablet-border-radius', t.borderRadius);
        
        setVar('--s-mobile-bg-color', m.bgColor);
        setVar('--s-mobile-padding', m.padding);
        setVar('--s-mobile-margin', m.margin);
        setVar('--s-mobile-font-size', m.fontSize);
        setVar('--s-mobile-font-weight', m.fontWeight);
        setVar('--s-mobile-color', m.color);
        setVar('--s-mobile-border-width', m.borderWidth);
        setVar('--s-mobile-border-color', m.borderColor);
        setVar('--s-mobile-border-radius', m.borderRadius);

        // Header positioning (sticky, fixed, absolute, static)
        if (s.position) style.position = s.position;
        if (s.top !== undefined && s.top !== '') style.top = s.top;
        if (s.zIndex) style.zIndex = s.zIndex;

        const isSelected = selectedElement.id === 'header' && selectedElement.type === 'header';
        const isChildActive = selectedElement.sectionId === 'header';
        const stateSimClass = isSelected && activeStyleState !== 'normal' ? `cms-simulate-${activeStyleState}` : '';
        const visibilityClass = [
            s.hideDesktop ? 'd-none-desktop' : '',
            s.hideTablet ? 'd-none-tablet' : '',
            s.hideMobile ? 'd-none-mobile' : ''
        ].filter(Boolean).join(' ');

        return (
            <div
                ref={headerRef}
                className={`seczone headzone cms-sec-header ${stateSimClass} ${visibilityClass}`.trim()}
                data-cms-active={isSelected ? 'true' : undefined}
                data-cms-child-active={isChildActive ? 'true' : undefined}
                style={style}
                onClick={(e) => {
                    if (e.target.closest('.seczone-block') || e.target.closest('.seczone-layout')) {
                        return;
                    }
                    e.stopPropagation();
                    setSelectedElement({ type: 'header', id: 'header', data: headerData });
                }}
            >
                <div className="seczone-in">
                    <header className={`web-header ${s.innerClass || ''}`} style={{
                        flexDirection: s.flexDirection,
                        alignItems: s.alignItems,
                        justifyContent: s.justifyContent,
                        height: s.height
                    }}>
                        <div
                            className='web-header-left'
                            onClick={s.logoLinkToHome ? (e) => e.preventDefault() : undefined}
                            style={s.logoLinkToHome ? { cursor: 'pointer' } : {}}
                        >
                            {(() => {
                                const logoSettings = s.logoSettings || {};
                                const logoStyle = {};
                                if (logoSettings.bgColor) logoStyle.backgroundColor = logoSettings.bgColor;
                                if (logoSettings.padding) logoStyle.padding = logoSettings.padding;
                                if (logoSettings.margin) logoStyle.margin = logoSettings.margin;
                                if (logoSettings.borderRadius) logoStyle.borderRadius = logoSettings.borderRadius;
                                if (logoSettings.borderWidth) logoStyle.borderWidth = logoSettings.borderWidth;
                                if (logoSettings.borderStyle) logoStyle.borderStyle = logoSettings.borderStyle;
                                if (logoSettings.borderColor) logoStyle.borderColor = logoSettings.borderColor;
                                if (logoSettings.height) logoStyle.height = logoSettings.height;
                                if (logoSettings.width) logoStyle.width = logoSettings.width;

                                return (
                                    <div 
                                        className={`web-header-logo`}
                                        data-cms-active={selectedElement.type === 'logo' ? 'true' : undefined}
                                        style={{
                                            ...logoStyle,
                                            outline: selectedElement.type === 'logo' ? '2px dashed var(--cms-primary)' : ''
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (s.logoLinkToHome) e.preventDefault();
                                            setSelectedElement({ type: 'logo', id: 'logo', sectionId: 'header', data: { settings: logoSettings } });
                                        }}
                                    >
                                        <img src="/defaults/dashboard/dashboard.png" alt="logo" />
                                        <ResizeHandles sectionId="header" currentPath="logo" isSelected={selectedElement.type === 'logo'} />
                                    </div>
                                );
                            })()}
                            {(() => {
                                if (!headerData) return null;
                                const s = headerData.settings || {};
                                const showTitle = s.showTitle ?? true;
                                const showSubtitle = s.showSubtitle ?? true;

                                const mappedContent = (headerData.content || []).map((b, i) => ({ ...b, _pathIdx: i }));
                                const textBlocks = mappedContent.filter(b => b.block_type !== 'button');

                                let titleBlock = textBlocks.find(b => b.tag === 'h1');
                                let subtitleBlock = textBlocks.find(b => b.tag === 'h4');

                                // Fallback: If no strict h1/h4 tags exist, assume 1st text block is Title, 2nd is Subtitle
                                if (!titleBlock && textBlocks.length > 0) {
                                    const firstBlock = textBlocks.find(b => b._pathIdx !== subtitleBlock?._pathIdx);
                                    if (firstBlock) titleBlock = { ...firstBlock, tag: 'h1' };
                                }
                                if (!subtitleBlock && textBlocks.length > 1) {
                                    const secondBlock = textBlocks.find(b => b._pathIdx !== titleBlock?._pathIdx);
                                    if (secondBlock) subtitleBlock = { ...secondBlock, tag: 'h4' };
                                }

                                // Auto-inject missing blocks so they are fully editable
                                if (showTitle && !titleBlock) {
                                    if (!headerData.content) headerData.content = [];
                                    const newTitle = { block_type: 'text', tag: 'h1', content: 'Header Title', properties: { margin: '0', color: '#1178ac' } };
                                    headerData.content.push(newTitle);
                                    titleBlock = { ...newTitle, _pathIdx: headerData.content.length - 1 };
                                }

                                if (showSubtitle && !subtitleBlock) {
                                    if (!headerData.content) headerData.content = [];
                                    const newSub = { block_type: 'text', tag: 'h4', content: 'Header Subtitle', properties: { margin: '0', color: '#469dc8', 'font-weight': 'normal' } };
                                    headerData.content.push(newSub);
                                    subtitleBlock = { ...newSub, _pathIdx: headerData.content.length - 1 };
                                }

                                const hasTitleContent = showTitle && titleBlock;
                                const hasSubtitleContent = showSubtitle && subtitleBlock;

                                if (!hasTitleContent && !hasSubtitleContent) return null;

                                return (
                                    <div className='web-header-titles'>
                                        {hasTitleContent && renderBlocks([titleBlock], 'header')}
                                        {hasSubtitleContent && renderBlocks([subtitleBlock], 'header')}
                                    </div>
                                );
                            })()}
                        </div>

                        {(() => {
                            const navSettings = s.navSettings || {};
                            const navStyle = {};
                            if (navSettings.gap) navStyle['--nav-gap'] = navSettings.gap;
                            if (navSettings.color) navStyle['--nav-color'] = navSettings.color;
                            if (navSettings.hoverColor) navStyle['--nav-hover-color'] = navSettings.hoverColor;
                            if (navSettings.fontSize) navStyle['--nav-font-size'] = navSettings.fontSize;
                            if (navSettings.hoverFontSize) navStyle['--nav-hover-font-size'] = navSettings.hoverFontSize;
                            if (navSettings.fontWeight) navStyle['--nav-font-weight'] = navSettings.fontWeight;
                            if (navSettings.hoverFontWeight) navStyle['--nav-hover-font-weight'] = navSettings.hoverFontWeight;
                            if (navSettings.fontStyle) navStyle['--nav-font-style'] = navSettings.fontStyle;
                            if (navSettings.hoverFontStyle) navStyle['--nav-hover-font-style'] = navSettings.hoverFontStyle;
                            if (navSettings.textDecoration) navStyle['--nav-text-decoration'] = navSettings.textDecoration;
                            if (navSettings.hoverTextDecoration) navStyle['--nav-hover-text-decoration'] = navSettings.hoverTextDecoration;
                            if (navSettings.padding) navStyle['--nav-padding'] = navSettings.padding;
                            if (navSettings.margin) navStyle['--nav-margin'] = navSettings.margin;
                            if (navSettings.bgColor) navStyle['--nav-bg'] = navSettings.bgColor;
                            if (navSettings.hoverBgColor) navStyle['--nav-hover-bg'] = navSettings.hoverBgColor;
                            if (navSettings.borderRadius) navStyle['--nav-border-radius'] = navSettings.borderRadius;
                            if (navSettings.transition) navStyle['--nav-transition'] = navSettings.transition;
                            if (navSettings.flexDirection) navStyle.flexDirection = navSettings.flexDirection;
                            navStyle.justifyContent = navSettings.justifyContent || (s.navAlign === 'left' ? 'flex-start' : s.navAlign === 'right' ? 'flex-end' : 'center');
                            if (navSettings.alignItems) navStyle.alignItems = navSettings.alignItems;
                            if (navSettings.height) navStyle.height = navSettings.height;
                            if (navSettings.width) navStyle.width = navSettings.width;

                            const dropdownSettings = s.dropdownSettings || {};
                            const dropdownStyle = {};
                            if (dropdownSettings.bgColor) dropdownStyle['--dropdown-bg'] = dropdownSettings.bgColor;
                            if (dropdownSettings.padding) dropdownStyle['--dropdown-padding'] = dropdownSettings.padding;
                            if (dropdownSettings.borderRadius) dropdownStyle['--dropdown-border-radius'] = dropdownSettings.borderRadius;
                            if (dropdownSettings.boxShadow) dropdownStyle['--dropdown-box-shadow'] = dropdownSettings.boxShadow;
                            if (dropdownSettings.borderWidth) dropdownStyle['--dropdown-border-width'] = dropdownSettings.borderWidth;
                            if (dropdownSettings.borderColor) dropdownStyle['--dropdown-border-color'] = dropdownSettings.borderColor;
                            
                            if (dropdownSettings.color) dropdownStyle['--dropdown-link-color'] = dropdownSettings.color;
                            if (dropdownSettings.hoverColor) dropdownStyle['--dropdown-link-hover-color'] = dropdownSettings.hoverColor;
                            if (dropdownSettings.hoverBgColor) dropdownStyle['--dropdown-link-hover-bg'] = dropdownSettings.hoverBgColor;
                            if (dropdownSettings.fontSize) dropdownStyle['--dropdown-link-font-size'] = dropdownSettings.fontSize;
                            if (dropdownSettings.fontWeight) dropdownStyle['--dropdown-link-font-weight'] = dropdownSettings.fontWeight;
                            if (dropdownSettings.padding) dropdownStyle['--dropdown-link-padding'] = dropdownSettings.padding;

                            const getLocalNavStyle = (settings, isDropdown) => {
                                if (!settings) return {};
                                const s = {};
                                const prefix = isDropdown ? '--dropdown-link-' : '--nav-';
                                if (settings.color) s[`${prefix}color`] = settings.color;
                                if (settings['hover-color']) s[`${prefix}hover-color`] = settings['hover-color'];
                                if (settings['bg-color']) s[`${prefix}bg`] = settings['bg-color'];
                                if (settings['hover-bg-color']) s[`${prefix}hover-bg`] = settings['hover-bg-color'];
                                if (settings['font-size']) s[`${prefix}font-size`] = settings['font-size'];
                                if (settings['font-weight']) s[`${prefix}font-weight`] = settings['font-weight'];
                                if (settings.padding) s[`${prefix}padding`] = settings.padding;
                                if (settings.margin) s[`${prefix}margin`] = settings.margin;
                                if (settings['border-radius']) s[`${prefix}border-radius`] = settings['border-radius'];
                                if (settings.width) s.width = settings.width;
                                if (settings.height) s.height = settings.height;
                                if (settings.transition) {
                                    s[`${prefix}transition`] = settings.transition;
                                    s['--b-transition'] = settings.transition;
                                }
                                return s;
                            };
                            const navVisibilityClass = [
                                navSettings.hideDesktop ? 'd-none-desktop' : '',
                                navSettings.hideTablet ? 'd-none-tablet' : '',
                                navSettings.hideMobile ? 'd-none-mobile' : ''
                            ].filter(Boolean).join(' ');

                            return (
                                <div 
                                    className={`web-header-middle ${navVisibilityClass}`.trim()}
                                    data-cms-active={selectedElement.type === 'nav' ? 'true' : undefined}
                                    style={{ ...navStyle, outline: selectedElement.type === 'nav' ? '2px dashed var(--cms-primary)' : '' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedElement({ type: 'nav', id: 'nav', sectionId: 'header', data: { settings: navSettings } });
                                    }}
                                >
                                    {navigations && navigations.filter(nav => !nav.parent_id).map((parentNav) => {
                                const subLinks = navigations.filter(nav => nav.parent_id === parentNav.id);
                                const hasSubLinks = subLinks.length > 0;
                                const dropdownTrigger = headerData?.settings?.dropdownTrigger || 'hover';
                                const isOpen = openDropdownId === parentNav.id;
                                
                                return (
                                    <div 
                                        key={parentNav.id} 
                                        className={`web-navbar-item ${hasSubLinks ? 'has-dropdown' : ''} ${dropdownTrigger === 'hover' ? 'trigger-hover' : 'trigger-click'} ${isOpen ? 'is-open' : ''} ${parentNav.settings?.hideDesktop ? 'd-none-desktop' : ''} ${parentNav.settings?.hideTablet ? 'd-none-tablet' : ''} ${parentNav.settings?.hideMobile ? 'd-none-mobile' : ''}`.trim()}
                                    >
                                        <a 
                                            href={parentNav.url} 
                                            target={parentNav.settings?.target || '_self'}
                                            title={parentNav.settings?.title || ''}
                                            aria-label={parentNav.settings?.['aria-label'] || ''}
                                            className={`web-navbar-link ${parentNav.settings?.['button-style'] || ''} ${parentNav.settings?.['button-variant'] || ''} ${parentNav.settings?.['button-size'] || ''} ${parentNav.settings?.['button-style'] ? 'button' : ''} ${parentNav.settings?.hoverScale === 'zoom' ? 'hover-zoom' : ''}`.trim()}
                                            data-cms-active={selectedElement.type === 'nav-link' && selectedElement.id === parentNav.id ? 'true' : undefined}
                                            style={{ outline: selectedElement.type === 'nav-link' && selectedElement.id === parentNav.id ? '2px dashed var(--cms-primary)' : '', ...getLocalNavStyle(parentNav.settings, false) }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedElement({ type: 'nav-link', id: parentNav.id, sectionId: 'header', data: { ...parentNav, properties: parentNav.settings } });
                                                if (hasSubLinks && dropdownTrigger === 'click') {
                                                    setOpenDropdownId(isOpen ? null : parentNav.id);
                                                }
                                            }}
                                        >
                                            {parentNav.settings?.iconLeft && <Icon icon={icons[parentNav.settings.iconLeft]} style={{ marginRight: parentNav.settings.iconGap || '0px' }} />}
                                            <span contentEditable={selectedElement.type === 'nav-link' && selectedElement.id === parentNav.id} suppressContentEditableWarning={true}
                                                onBlur={(e) => {
                                                    const newContent = e.target.innerText;
                                                    if (newContent !== parentNav.label) {
                                                        updateNavigationProperty(parentNav.id, 'label', newContent);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        e.target.blur();
                                                    }
                                                }}
                                                style={{ outline: 'none', padding: '5px' }}
                                            >
                                                {parentNav.label}
                                            </span>
                                            {parentNav.settings?.iconRight && <Icon icon={icons[parentNav.settings.iconRight]} style={{ marginLeft: parentNav.settings.iconGap || '0px' }} />}
                                            {hasSubLinks && <Icon icon={icons.chevronDown} className="dropdown-icon" />}
                                            <ResizeHandles sectionId="header" currentPath={parentNav.id} isNav={true} isSelected={selectedElement.type === 'nav-link' && selectedElement.id === parentNav.id} />
                                        </a>
                                        {hasSubLinks && (
                                            <div 
                                                className='web-navbar-dropdown'
                                                data-cms-active={selectedElement.type === 'nav-dropdown' ? 'true' : undefined}
                                                style={{...dropdownStyle, outline: selectedElement.type === 'nav-dropdown' ? '2px dashed var(--cms-primary)' : ''}}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedElement({ type: 'nav-dropdown', id: 'nav-dropdown', sectionId: 'header', data: { settings: dropdownSettings } });
                                                }}
                                            >
                                                {subLinks.map(subNav => (
                                                    <a 
                                                        key={subNav.id} 
                                                        href={subNav.url} 
                                                        target={subNav.settings?.target || '_self'}
                                                        title={subNav.settings?.title || ''}
                                                        aria-label={subNav.settings?.['aria-label'] || ''}
                                                        className={`web-dropdown-link ${subNav.settings?.['button-style'] || ''} ${subNav.settings?.['button-variant'] || ''} ${subNav.settings?.['button-size'] || ''} ${subNav.settings?.['button-style'] ? 'button' : ''} ${subNav.settings?.hoverScale === 'zoom' ? 'hover-zoom' : ''} ${subNav.settings?.hideDesktop ? 'd-none-desktop' : ''} ${subNav.settings?.hideTablet ? 'd-none-tablet' : ''} ${subNav.settings?.hideMobile ? 'd-none-mobile' : ''}`.trim()}
                                                        data-cms-active={selectedElement.type === 'nav-link' && selectedElement.id === subNav.id ? 'true' : undefined}
                                                        style={{ outline: selectedElement.type === 'nav-link' && selectedElement.id === subNav.id ? '2px dashed var(--cms-primary)' : '', ...getLocalNavStyle(subNav.settings, true) }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setSelectedElement({ type: 'nav-link', id: subNav.id, sectionId: 'header', data: { ...subNav, properties: subNav.settings } });
                                                        }}
                                                    >
                                                        {subNav.settings?.iconLeft && <Icon icon={icons[subNav.settings.iconLeft]} style={{ marginRight: subNav.settings.iconGap || '0px' }} />}
                                                        <span contentEditable={selectedElement.type === 'nav-link' && selectedElement.id === subNav.id} suppressContentEditableWarning={true}
                                                            onBlur={(e) => {
                                                                const newContent = e.target.innerText;
                                                                if (newContent !== subNav.label) {
                                                                    updateNavigationProperty(subNav.id, 'label', newContent);
                                                                }
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    e.target.blur();
                                                                }
                                                            }}
                                                            style={{ outline: 'none', padding: '5px' }}
                                                        >
                                                            {subNav.label}
                                                        </span>
                                                        {subNav.settings?.iconRight && <Icon icon={icons[subNav.settings.iconRight]} style={{ marginLeft: subNav.settings.iconGap || '0px' }} />}
                                                        <ResizeHandles sectionId="header" currentPath={subNav.id} isNav={true} isSelected={selectedElement.type === 'nav-link' && selectedElement.id === subNav.id} />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                                </div>
                            );
                        })()}

                        <div className='web-header-right'>
                            {s.showCustomButtons !== false && renderBlocks((headerData.content || []).map((b, i) => ({ ...b, _pathIdx: i })).filter((b, i) => b.block_type === 'button'), 'header')}
                        </div>
                    </header>
                </div>
                {/* 
                <div className="seczone-in">
                    <div className={`cms-dynamic-header ${s.innerClass || ''}`}>
                        <div className="cms-header-left">
                            <div className="cms-header-logo-img">
                                <img src="/defaults/dashboard/dashboard.png" alt="logo" />
                            </div>
                            <div className="cms-header-titles">
                                {renderBlocks((headerData.content || []).map((b, i) => ({...b, _pathIdx: i})).filter((b, i) => b.block_type !== 'button'), 'header')}
                            </div>
                        </div>
                        
                        <div className={`cms-header-middle align-${s.navAlign || 'center'}`}>
                            {navigations && navigations.filter(nav => !nav.parent_id).map((parentNav) => (
                                <div key={parentNav.id} className="cms-nav-item">
                                    <a href={parentNav.url} className="cms-nav-link">{parentNav.label}</a>
                                </div>
                            ))}
                        </div>
                        
                        <div className="cms-header-right">
                            {s.showCustomButtons !== false && renderBlocks((headerData.content || []).map((b, i) => ({...b, _pathIdx: i})).filter((b, i) => b.block_type === 'button'), 'header')}
                        </div>
                    </div>
                </div>
                 */}
                {isSelected && (
                    <div
                        className="section-resize-handle"
                        onMouseDown={(e) => handleSectionResizeStart(e, 'header', headerRef)}
                    >
                        <span className="resize-handle-dots"></span>
                    </div>
                )}
            </div>
        );
    };

    const renderFooterSection = () => {
        if (!footerData) return null;

        const s = footerData.settings || {};
        const t = s.responsive?.tablet || {};
        const m = s.responsive?.mobile || {};
        const style = {};

        const setVar = (varName, value) => {
            if (value !== undefined && value !== null && value !== '') {
                style[varName] = value;
            }
        };

        // Map footer settings to styles matching CmsSection
        setVar('--sec-bg-color', s.bgColor);
        if (s.bgImage) style['--sec-bg-image'] = `url(${s.bgImage})`;
        setVar('--sec-padding', s.padding);
        setVar('--sec-margin', s.margin);
        setVar('--sec-color', s.color);
        setVar('--sec-font-size', s.fontSize);
        setVar('--sec-font-weight', s.fontWeight);
        if (s.boxShadow) style.boxShadow = s.boxShadow;

        // Background advanced settings
        setVar('--sec-bg-position', s.bgPosition);
        setVar('--sec-bg-repeat', s.bgRepeat);
        setVar('--sec-bg-size', s.bgSize);

        // Overlay
        setVar('--sec-overlay-color', s.overlayColor);
        if (s.overlayOpacity !== undefined && s.overlayOpacity !== 0) style['--sec-overlay-opacity'] = s.overlayOpacity;

        // Border
        setVar('--sec-border-width', s.borderWidth);
        setVar('--sec-border-style', s.borderStyle);
        setVar('--sec-border-color', s.borderColor);
        setVar('--sec-border-radius', s.borderRadius);

        // Interaction states
        setVar('--s-hover-bg-color', s.hoverBgColor);
        setVar('--s-hover-color', s.hoverColor);
        setVar('--s-hover-border-color', s.hoverBorderColor);
        setVar('--s-active-bg-color', s.activeBgColor);

        // Responsive inline overrides based on the current view mode
        if (view === 'tablet') {
            setVar('--sec-bg-color', t.bgColor);
            if (t.bgImage) style['--sec-bg-image'] = `url(${t.bgImage})`;
            setVar('--sec-padding', t.padding);
            setVar('--sec-margin', t.margin);
            setVar('--sec-font-size', t.fontSize);
            setVar('--sec-font-weight', t.fontWeight);
            setVar('--sec-color', t.color);
            setVar('--sec-border-width', t.borderWidth);
            setVar('--sec-border-color', t.borderColor);
            setVar('--sec-border-radius', t.borderRadius);
            if (t.boxShadow) style.boxShadow = t.boxShadow;
            setVar('--sec-overlay-color', t.overlayColor);
            if (t.overlayOpacity !== undefined && t.overlayOpacity !== 0) style['--sec-overlay-opacity'] = t.overlayOpacity;
        } else if (view === 'mobile') {
            setVar('--sec-bg-color', m.bgColor || t.bgColor);
            if (m.bgImage || t.bgImage) style['--sec-bg-image'] = `url(${m.bgImage || t.bgImage})`;
            setVar('--sec-padding', m.padding || t.padding);
            setVar('--sec-margin', m.margin || t.margin);
            setVar('--sec-font-size', m.fontSize || t.fontSize);
            setVar('--sec-font-weight', m.fontWeight || t.fontWeight);
            setVar('--sec-color', m.color || t.color);
            setVar('--sec-border-width', m.borderWidth || t.borderWidth);
            setVar('--sec-border-color', m.borderColor || t.borderColor);
            setVar('--sec-border-radius', m.borderRadius || t.borderRadius);
            if (m.boxShadow || t.boxShadow) style.boxShadow = m.boxShadow || t.boxShadow;
            setVar('--sec-overlay-color', m.overlayColor || t.overlayColor);
            if ((m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity) !== undefined && 
                (m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity) !== 0) {
                style['--sec-overlay-opacity'] = m.overlayOpacity !== undefined ? m.overlayOpacity : t.overlayOpacity;
            }
        }

        // Output viewport-specific responsive variables for the CSS cascade
        setVar('--s-tablet-bg-color', t.bgColor);
        setVar('--s-tablet-padding', t.padding);
        setVar('--s-tablet-margin', t.margin);
        setVar('--s-tablet-font-size', t.fontSize);
        setVar('--s-tablet-font-weight', t.fontWeight);
        setVar('--s-tablet-color', t.color);
        setVar('--s-tablet-border-width', t.borderWidth);
        setVar('--s-tablet-border-color', t.borderColor);
        setVar('--s-tablet-border-radius', t.borderRadius);
        
        setVar('--s-mobile-bg-color', m.bgColor);
        setVar('--s-mobile-padding', m.padding);
        setVar('--s-mobile-margin', m.margin);
        setVar('--s-mobile-font-size', m.fontSize);
        setVar('--s-mobile-font-weight', m.fontWeight);
        setVar('--s-mobile-color', m.color);
        setVar('--s-mobile-border-width', m.borderWidth);
        setVar('--s-mobile-border-color', m.borderColor);
        setVar('--s-mobile-border-radius', m.borderRadius);

        const isSelected = selectedElement.id === 'footer' && selectedElement.type === 'footer';
        const isChildActive = selectedElement.sectionId === 'footer';
        const stateSimClass = isSelected && activeStyleState !== 'normal' ? `cms-simulate-${activeStyleState}` : '';
        const visibilityClass = [
            s.hideDesktop ? 'd-none-desktop' : '',
            s.hideTablet ? 'd-none-tablet' : '',
            s.hideMobile ? 'd-none-mobile' : ''
        ].filter(Boolean).join(' ');

        return (
            <div
                ref={footerRef}
                className={`seczone footzone cms-sec-footer ${isSelected ? 'active' : ''} ${isChildActive ? 'child-active' : ''} ${stateSimClass} ${visibilityClass}`.trim()}
                data-cms-active={isSelected ? 'true' : undefined}
                data-cms-child-active={isChildActive ? 'true' : undefined}
                style={style}
                onClick={(e) => {
                    if (e.target.closest('.seczone-block') || e.target.closest('.seczone-layout')) {
                        return;
                    }
                    e.stopPropagation();
                    setSelectedElement({ type: 'footer', id: 'footer', data: footerData });
                }}
            >
                <div className="seczone-in">
                    {s.layout === 'flex-block' ? (
                        <div
                            className={`flex-block ${s.innerClass || ''}`}
                            style={{
                                gap: s.gap || '30px',
                                alignItems: s.alignItems || 'stretch',
                                justifyContent: s.justifyContent || 'space-between',
                            }}
                        >
                            {renderBlocks(footerData.content, 'footer')}
                        </div>
                    ) : (
                        <div className={s.innerClass || ''}>
                            {renderBlocks(footerData.content, 'footer')}
                        </div>
                    )}
                </div>
                {isSelected && (
                    <div
                        className="section-resize-handle"
                        onMouseDown={(e) => handleSectionResizeStart(e, 'footer', footerRef)}
                    >
                        <span className="resize-handle-dots"></span>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <main className='cms-editor-body'>
                <div className='cms-canva-body scrollbar-admin'>
                    <div className="cms-canvas-loader-container">
                        <div className="cms-canvas-loader"></div>
                        <p>Loading Page Content...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (<main className='cms-editor-body'>
        <div className='cms-canva-head'><CmsCanvasToolbar /></div>

        <div className='cms-canva-body scrollbar-admin' onClick={(e) => {
            if (e.target.closest('.seczone') || e.target.closest('.block-toolbar') || e.target.closest('.cms-canvas-toolbar')) {
                return;
            }
            setSelectedElement({ type: null, id: null, data: null });
        }}>
            <div className={`cms-webpage ${view}`}>
                <div className='web-container' >
                    <div className='webpage-panel'>
                        {/* Scoped Canvas Header */}
                        {!!(pageData.page?.has_header ?? pageData.has_header) && renderHeaderSection()}

                        {pageData.sections?.length > 0 ? (
                            pageData.sections.map(section => renderSection(section))
                        ) : (
                            <div className='seczone'>
                                <div className='seczone-in'>
                                    <p style={{ textAlign: 'center', opacity: 0.5 }}>No sections added to this page.</p>
                                </div>
                            </div>
                        )}

                        {/* Scoped Canvas Footer */}
                        {!!(pageData.page?.has_footer ?? pageData.has_footer) && renderFooterSection()}
                    </div>
                </div>
            </div>
        </div>

        <div className='cms-canva-foot'></div>
    </main>);
};

export default CmsCanvas;