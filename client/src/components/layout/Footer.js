import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import CmsBlockRenderer from '../cms/CmsBlockRenderer';

const Footer = ({ settingsTimestamp }) => {
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                // Fetch public footer (supports project scoping, fallback to main if none is active)
                const projectId = localStorage.getItem('active_project_id') || '';
                const response = await api.get('/api/web/footer', { params: { id_project: projectId } });
                if (response.data.success) {
                    setFooterData(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch public footer:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFooter();
    }, [settingsTimestamp]); // Re-fetch footer if settings are updated or page is republished!

    if (loading) {
        return (
            <footer className="footer-loading" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                Loading...
            </footer>
        );
    }

    if (!footerData) {
        return null;
    }

    const s = footerData.settings || {};
    const t = s.responsive?.tablet || {};
    const m = s.responsive?.mobile || {};
    const blocks = footerData.blocks || [];
    const style = {};

    const setVar = (varName, value) => {
        if (value !== undefined && value !== null && value !== '') {
            style[varName] = value;
        }
    };

    // Map footer settings to CSS variables matching CmsSectionRenderer
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

    return (
        <footer className="seczone footzone cms-sec-footer" style={style}>
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
                        {blocks?.map((block, idx) => (
                            <CmsBlockRenderer key={idx} block={block} sectionId="footer" parentPath={`${idx}`} />
                        ))}
                    </div>
                ) : (
                    <div className={s.innerClass || ''}>
                        {blocks?.map((block, idx) => (
                            <CmsBlockRenderer key={idx} block={block} sectionId="footer" parentPath={`${idx}`} />
                        ))}
                    </div>
                )}
            </div>
        </footer>
    );
};

export default Footer;