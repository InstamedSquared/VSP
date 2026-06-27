import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import CmsBlockRenderer from '../cms/CmsBlockRenderer';
import Icon from '../common/Icon';
import { icons } from '../../config/icons';

const Navbar = ({ settings, settingsTimestamp }) => {
    const [headerData, setHeaderData] = useState(null);
    const [navigations, setNavigations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
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

    useEffect(() => {
        const fetchHeaderAndNav = async () => {
            try {
                const projectId = localStorage.getItem('active_project_id') || '';
                const [headerRes, navRes] = await Promise.all([
                    api.get('/api/web/header', { params: { id_project: projectId } }),
                    api.get('/api/web/navigations', { params: { id_project: projectId } })
                ]);

                if (headerRes.data.success) {
                    setHeaderData(headerRes.data.data);
                }
                if (navRes.data.success) {
                    setNavigations(navRes.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch public header/navigations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHeaderAndNav();
    }, [settingsTimestamp]);

    if (!loading && headerData) {
        const s = headerData.settings || {};
        const t = s.responsive?.tablet || {};
        const m = s.responsive?.mobile || {};
        const blocks = headerData.blocks || [];
        const style = {};

        const setVar = (varName, value) => {
            if (value !== undefined && value !== null && value !== '') {
                style[varName] = value;
            }
        };

        // Map header settings to CSS variables matching CmsSectionRenderer
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

        const navSettings = s.navSettings || {};
        const mobileNavStyle = navSettings.mobileNavStyle || 'popup';
        if (navSettings.gap) style['--nav-gap'] = navSettings.gap;
        if (navSettings.color) style['--nav-color'] = navSettings.color;
        if (navSettings.hoverColor) style['--nav-hover-color'] = navSettings.hoverColor;
        if (navSettings.fontSize) style['--nav-font-size'] = navSettings.fontSize;
        if (navSettings.fontWeight) style['--nav-font-weight'] = navSettings.fontWeight;
        if (navSettings.padding) style['--nav-padding'] = navSettings.padding;
        if (navSettings.margin) style['--nav-margin'] = navSettings.margin;
        if (navSettings.bgColor) style['--nav-bg'] = navSettings.bgColor;
        if (navSettings.hoverBgColor) style['--nav-hover-bg'] = navSettings.hoverBgColor;
        if (navSettings.borderRadius) style['--nav-border-radius'] = navSettings.borderRadius;
        if (navSettings.transition) style['--nav-transition'] = navSettings.transition;

        return (
            <div className={`seczone headzone cms-sec-header ${menuOpen ? 'menu-open' : ''} mobile-nav-${mobileNavStyle}`} style={style}>
                <div className="seczone-in">
                    <header className={`web-header ${s.innerClass || ''}`}>
                        {s.logoLinkToHome ? (
                            <Link to="/" className='web-header-left'>
                                <div className='web-header-logo'>
                                    <img src={settings?.logo ? `/defaults/logo/${settings.logo}?t=${settingsTimestamp}` : "/defaults/dashboard/dashboard.png"} alt="logo" />
                                </div>
                                {(() => {
                                    const showTitle = s.showTitle ?? true;
                                    const showSubtitle = s.showSubtitle ?? true;

                                    const mappedContent = (blocks || []).map((b, i) => ({ ...b, _pathIdx: i }));
                                    const textBlocks = mappedContent.filter(b => b.block_type !== 'button');

                                    let titleBlock = textBlocks.find(b => b.tag === 'h1');
                                    let subtitleBlock = textBlocks.find(b => b.tag === 'h4');

                                    if (!titleBlock && textBlocks.length > 0) {
                                        const firstBlock = textBlocks.find(b => b._pathIdx !== subtitleBlock?._pathIdx);
                                        if (firstBlock) titleBlock = { ...firstBlock, tag: 'h1' };
                                    }
                                    if (!subtitleBlock && textBlocks.length > 1) {
                                        const secondBlock = textBlocks.find(b => b._pathIdx !== titleBlock?._pathIdx);
                                        if (secondBlock) subtitleBlock = { ...secondBlock, tag: 'h4' };
                                    }

                                    const hasTitleContent = showTitle && titleBlock;
                                    const hasSubtitleContent = showSubtitle && subtitleBlock;

                                    if (!hasTitleContent && !hasSubtitleContent) return null;

                                    return (
                                        <div className='web-header-titles'>
                                            {hasTitleContent && <CmsBlockRenderer block={titleBlock} sectionId="header" parentPath={`${titleBlock._pathIdx}`} />}
                                            {hasSubtitleContent && <CmsBlockRenderer block={subtitleBlock} sectionId="header" parentPath={`${subtitleBlock._pathIdx}`} />}
                                        </div>
                                    );
                                })()}
                            </Link>
                        ) : (
                            <div className='web-header-left'>
                                <div className='web-header-logo'>
                                    <img src={settings?.logo ? `/defaults/logo/${settings.logo}?t=${settingsTimestamp}` : "/defaults/dashboard/dashboard.png"} alt="logo" />
                                </div>
                                {(() => {
                                    const showTitle = s.showTitle ?? true;
                                    const showSubtitle = s.showSubtitle ?? true;

                                    const mappedContent = (blocks || []).map((b, i) => ({ ...b, _pathIdx: i }));
                                    const textBlocks = mappedContent.filter(b => b.block_type !== 'button');

                                    let titleBlock = textBlocks.find(b => b.tag === 'h1');
                                    let subtitleBlock = textBlocks.find(b => b.tag === 'h4');

                                    if (!titleBlock && textBlocks.length > 0) {
                                        const firstBlock = textBlocks.find(b => b._pathIdx !== subtitleBlock?._pathIdx);
                                        if (firstBlock) titleBlock = { ...firstBlock, tag: 'h1' };
                                    }
                                    if (!subtitleBlock && textBlocks.length > 1) {
                                        const secondBlock = textBlocks.find(b => b._pathIdx !== titleBlock?._pathIdx);
                                        if (secondBlock) subtitleBlock = { ...secondBlock, tag: 'h4' };
                                    }

                                    const hasTitleContent = showTitle && titleBlock;
                                    const hasSubtitleContent = showSubtitle && subtitleBlock;

                                    if (!hasTitleContent && !hasSubtitleContent) return null;

                                    return (
                                        <div className='web-header-titles'>
                                            {hasTitleContent && <CmsBlockRenderer block={titleBlock} sectionId="header" parentPath={`${titleBlock._pathIdx}`} />}
                                            {hasSubtitleContent && <CmsBlockRenderer block={subtitleBlock} sectionId="header" parentPath={`${subtitleBlock._pathIdx}`} />}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

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
                                <div className={`web-header-middle ${navVisibilityClass}`.trim()} style={navStyle}>
                                    <button className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                    {navigations && navigations.filter(nav => !nav.parent_id).map(parentNav => {
                                        const subLinks = navigations.filter(nav => nav.parent_id === parentNav.id);
                                        const hasSubLinks = subLinks.length > 0;
                                        const dropdownTrigger = headerData?.settings?.dropdownTrigger || 'hover';
                                        const isOpen = openDropdownId === parentNav.id;

                                        return (
                                            <div 
                                                key={parentNav.id} 
                                                className={`web-navbar-item ${hasSubLinks ? 'has-dropdown' : ''} ${dropdownTrigger === 'hover' ? 'trigger-hover' : 'trigger-click'} ${isOpen ? 'is-open' : ''} ${parentNav.settings?.hideDesktop ? 'd-none-desktop' : ''} ${parentNav.settings?.hideTablet ? 'd-none-tablet' : ''} ${parentNav.settings?.hideMobile ? 'd-none-mobile' : ''}`.trim()}
                                            >
                                                <Link 
                                                    className={`web-navbar-link ${parentNav.settings?.['button-style'] || ''} ${parentNav.settings?.['button-variant'] || ''} ${parentNav.settings?.['button-size'] || ''} ${parentNav.settings?.['button-style'] ? 'button' : ''} ${parentNav.settings?.hoverScale === 'zoom' ? 'hover-zoom' : ''}`.trim()}
                                                    to={parentNav.url || '#'}
                                                    target={parentNav.settings?.target || '_self'}
                                                    title={parentNav.settings?.title || ''}
                                                    aria-label={parentNav.settings?.['aria-label'] || ''}
                                                    style={getLocalNavStyle(parentNav.settings, false)}
                                                    onClick={(e) => {
                                                        const isMobile = window.innerWidth <= 767;
                                                        if (hasSubLinks && (dropdownTrigger === 'click' || isMobile)) {
                                                            e.preventDefault();
                                                            setOpenDropdownId(isOpen ? null : parentNav.id);
                                                        } else if (!hasSubLinks && isMobile) {
                                                            setMenuOpen(false);
                                                        }
                                                    }}
                                                >
                                                    {parentNav.settings?.iconLeft && <Icon icon={icons[parentNav.settings.iconLeft]} style={{ marginRight: parentNav.settings.iconGap || '0px' }} />}
                                                    {parentNav.label}
                                                    {parentNav.settings?.iconRight && <Icon icon={icons[parentNav.settings.iconRight]} style={{ marginLeft: parentNav.settings.iconGap || '0px' }} />}
                                                    {hasSubLinks && <Icon icon={icons.chevronDown} className="dropdown-icon" />}
                                                </Link>
                                                {hasSubLinks && (
                                                    <div className='web-navbar-dropdown' style={dropdownStyle}>
                                                        {subLinks.map(subNav => (
                                                            <Link 
                                                                key={subNav.id} 
                                                                className={`web-dropdown-link ${subNav.settings?.['button-style'] || ''} ${subNav.settings?.['button-variant'] || ''} ${subNav.settings?.['button-size'] || ''} ${subNav.settings?.['button-style'] ? 'button' : ''} ${subNav.settings?.hoverScale === 'zoom' ? 'hover-zoom' : ''} ${subNav.settings?.hideDesktop ? 'd-none-desktop' : ''} ${subNav.settings?.hideTablet ? 'd-none-tablet' : ''} ${subNav.settings?.hideMobile ? 'd-none-mobile' : ''}`.trim()}
                                                                to={subNav.url || '#'}
                                                                target={subNav.settings?.target || '_self'}
                                                                title={subNav.settings?.title || ''}
                                                                aria-label={subNav.settings?.['aria-label'] || ''}
                                                                style={getLocalNavStyle(subNav.settings, true)}
                                                                onClick={() => {
                                                                    if (window.innerWidth <= 767) setMenuOpen(false);
                                                                }}
                                                            >
                                                                {subNav.settings?.iconLeft && <Icon icon={icons[subNav.settings.iconLeft]} style={{ marginRight: subNav.settings.iconGap || '0px' }} />}
                                                                {subNav.label}
                                                                {subNav.settings?.iconRight && <Icon icon={icons[subNav.settings.iconRight]} style={{ marginLeft: subNav.settings.iconGap || '0px' }} />}
                                                            </Link>
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
                            {s.showCustomButtons !== false && (blocks || [])
                                .map((b, i) => ({ ...b, _pathIdx: i }))
                                .filter(b => b.block_type === 'button')
                                .map((block) => (
                                    <CmsBlockRenderer key={block._pathIdx} block={block} sectionId="header" parentPath={`${block._pathIdx}`} />
                                ))
                            }
                            <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                                <span></span>
                            </button>
                        </div>
                    </header>
                    {mobileNavStyle === 'drawer' && (
                        <div className={`mobile-nav-backdrop ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)}></div>
                    )}
                </div>
            </div>
        );
    }

    // Fallback: Hardcoded header
    return (
        <header className='header'><div className='sector'>
            <div className='header-in'>
                <Link to='/' className='logo'>
                    <img src={settings?.logo ? `/defaults/logo/${settings.logo}?t=${settingsTimestamp}` : `/defaults/no-image.webp`} alt="Logo" />
                    <span><h2>{settings?.system || 'TEMPLATE'}</h2><p>{settings?.subtitle || 'Global Management System'}</p></span>
                </Link>
                <nav className='nav'>
                    <Link className='navbar' to='/'>Home</Link>
                    <Link className='navbar' to='/about'>About</Link>
                    <Link className='navbar' to='/contact'>Contact</Link>
                    <Link className='navbar' to='/login'>Login</Link>
                </nav>
            </div>
        </div></header>
    );
};

export default Navbar;