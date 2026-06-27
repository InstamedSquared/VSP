import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { useCMS } from '../../context/CMSContext';
import { usePopupMenu } from '../../context/PopupMenuContext';

const getPropertyKey = (baseKey, state, type) => {
    if (!state || state === 'normal') return baseKey;
    if (type === 'block') {
        return `${state}-${baseKey}`;
    } else {
        const capitalized = baseKey.charAt(0).toUpperCase() + baseKey.slice(1);
        return `${state}${capitalized}`;
    }
};

const isSectionType = (t) => t === 'section' || t === 'header' || t === 'footer';

/**
 * Helper component for individual spacing inputs with unit selectors
 */
const UnitInput = ({ label, icon, valKey, defaultUnit, vals, handleChange, disabled }) => {
    const parseValue = (val, dUnit = 'px') => {
        if (!val) return { number: '', unit: dUnit };
        if (val === 'auto' || val === 'inherit') {
            return { number: '', unit: val };
        }
        const match = String(val).match(/^([-+]?\d*\.?\d*)(px|%|em|rem|vh|vw|auto|inherit)?$/);
        if (match) {
            return { number: match[1], unit: match[2] || dUnit };
        }
        return { number: val, unit: '' };
    };

    const { number, unit } = parseValue(vals[valKey], defaultUnit);
    const units = ['px', '%', 'em', 'rem', 'vh', 'vw', 'auto'];

    const isSpecialUnit = unit === 'auto' || unit === 'inherit';

    return (
        <div className={`popup-input-item ${disabled ? 'disabled' : ''}`}>
            <div className='input-label'><Icon icon={icon} /> {label}</div>
            <div className='popup-input-group'>
                <input
                    name={`ipt${label}`}
                    type="text"
                    placeholder={label}
                    value={isSpecialUnit ? '' : number}
                    disabled={disabled || isSpecialUnit}
                    autoComplete="off"
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, ''); // Numeric only
                        handleChange(valKey, val, unit);
                    }}
                />
                <select name={`select${label}`} value={unit} disabled={disabled} onChange={(e) => handleChange(valKey, number, e.target.value)} >
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
        </div>
    );
};

/**
 * Advanced Box Spacing controls (Padding/Margin) with 4 sides and Link/Unlink
 */
const BoxSpacingControls = ({ label, propKey, icon, vals, handleChange }) => {
    // Parse the spacing string into 4 numbers and 1 unit
    // Handles: "10px", "10px 20px", "10px 20px 30px 40px"
    const parseSpacing = (val) => {
        if (!val) return { t: '0', r: '0', b: '0', l: '0', unit: 'px' };

        const parts = String(val).split(' ').filter(p => p.trim() !== '');
        const extract = (s) => {
            const m = String(s).match(/^([-+]?\d*\.?\d*)(.*)$/);
            return { n: m ? m[1] : '0', u: m ? (m[2] || 'px') : 'px' };
        };

        const res = parts.map(extract);
        const unit = res[0]?.u || 'px';

        if (res.length === 1) return { t: res[0].n, r: res[0].n, b: res[0].n, l: res[0].n, unit };
        if (res.length === 2) return { t: res[0].n, r: res[1].n, b: res[0].n, l: res[1].n, unit };
        if (res.length === 3) return { t: res[0].n, r: res[1].n, b: res[2].n, l: res[1].n, unit };
        if (res.length >= 4) return { t: res[0].n, r: res[1].n, b: res[2].n, l: res[3].n, unit };

        return { t: '0', r: '0', b: '0', l: '0', unit };
    };

    const s = parseSpacing(vals[propKey]);

    const [isLinked, setIsLinked] = useState(() => {
        return s.t === s.b && s.t === s.l && s.t === s.r;
    });

    const handleSideChange = (side, num, unit) => {
        const cleanNum = num.replace(/[^0-9.]/g, '');
        let newSpacing = '';

        if (isLinked) {
            newSpacing = `${cleanNum}${unit}`;
        } else {
            const current = { ...s, [side]: cleanNum, unit };
            newSpacing = `${current.t}${unit} ${current.r}${unit} ${current.b}${unit} ${current.l}${unit}`;
        }

        handleChange(propKey, newSpacing, ''); // unit is already in the string
    };

    const handleUnitChange = (newUnit) => {
        let newSpacing = '';
        if (isLinked) {
            newSpacing = `${s.t}${newUnit}`;
        } else {
            newSpacing = `${s.t}${newUnit} ${s.r}${newUnit} ${s.b}${newUnit} ${s.l}${newUnit}`;
        }
        handleChange(propKey, newSpacing, '');
    };

    return (
        <div className='popup-input-toggle'>
            <header className='popup-input-item'>
                <div className='input-label'><Icon icon={icon} /> {label}</div>
                <button className={`popup-toolbar-btn ${isLinked ? 'active' : ''}`} onClick={() => setIsLinked(!isLinked)} title={isLinked ? "Unlink sides" : "Link sides"} >
                    <Icon icon={isLinked ? icons.link : icons.unLink} />
                </button>
                <select name={`${propKey}Unit`} value={s.unit} onChange={(e) => handleUnitChange(e.target.value)}>
                    {['px', '%', 'em', 'rem'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </header>

            <div className={`popup-input-grid ${isLinked ? 'linked' : 'unlinked'}`}>
                {isLinked ? (
                    <div className='popup-input-grid-single'>
                        <input name={`sb_${propKey}`} type="text" value={s.t} autoComplete="off" onChange={(e) => handleSideChange('t', e.target.value, s.unit)} placeholder="All sides" />
                    </div>
                ) : (
                    <div className='popup-input-grid-quad'>
                        <div className='quad-item'>
                            <Icon icon={icons.chevronUp} size={10} />
                            <input type="text" value={s.t} autoComplete="off" onChange={(e) => handleSideChange('t', e.target.value, s.unit)} title="Top" />
                        </div>
                        <div className='quad-item'>
                            <Icon icon={icons.chevronRight} size={10} />
                            <input type="text" value={s.r} autoComplete="off" onChange={(e) => handleSideChange('r', e.target.value, s.unit)} title="Right" />
                        </div>
                        <div className='quad-item'>
                            <Icon icon={icons.chevronDown} size={10} />
                            <input type="text" value={s.b} autoComplete="off" onChange={(e) => handleSideChange('b', e.target.value, s.unit)} title="Bottom" />
                        </div>
                        <div className='quad-item'>
                            <Icon icon={icons.chevronLeft} size={10} />
                            <input type="text" value={s.l} autoComplete="off" onChange={(e) => handleSideChange('l', e.target.value, s.unit)} title="Left" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Content for the Spacing Popup Menu
 */
const SpacingControls = ({ updateProperty, type }) => {
    const { view, selectedElement, activeStyleState } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const getValues = () => {
        const getVal = (baseKey) => {
            const stateKey = getPropertyKey(baseKey, activeStyleState, type);
            if (isSectionType(type)) {
                const settings = data.settings || {};
                const mobile = settings.responsive?.mobile || {};
                const tablet = settings.responsive?.tablet || {};

                let val;
                if (view === 'mobile') val = mobile[stateKey] || tablet[stateKey] || settings[stateKey];
                else if (view === 'tablet') val = tablet[stateKey] || settings[stateKey];
                else val = settings[stateKey];

                if (baseKey === 'padding' && !val) {
                    return '80px 0px';
                }
                return val;
            } else {
                const props = data.properties || {};
                const mobile = data.responsive?.mobile?.properties || {};
                const tablet = data.responsive?.tablet?.properties || {};
                if (view === 'mobile') return mobile[stateKey] || tablet[stateKey] || props[stateKey];
                if (view === 'tablet') return tablet[stateKey] || props[stateKey];
                return props[stateKey];
            }
        };
        const visibilityVals = isSectionType(type) ? data.settings || {} : data.properties || {};
        return {
            height: getVal('height'),
            width: getVal('width'),
            padding: getVal('padding'),
            margin: getVal('margin'),
            gap: getVal('gap') || (selectedElement?.data?.properties?.className?.includes('card-case') ? '10px' : ''),
            hideDesktop: visibilityVals.hideDesktop || false,
            hideTablet: visibilityVals.hideTablet || false,
            hideMobile: visibilityVals.hideMobile || false,
        };
    };

    const vals = getValues();

    const handleChange = (key, number, unit) => {
        let newValue = number;
        // Only append unit if number is not empty and not auto/inherit
        if (unit === 'auto' || unit === 'inherit') {
            newValue = unit;
        } else if (number && number !== 'auto' && number !== 'inherit' && unit) {
            newValue = number + unit;
        }

        let targetKey = key;
        if (type === 'block') {
            const mapping = {
                height: 'height',
                width: 'width',
                padding: 'padding',
                margin: 'margin',
                gap: 'gap'
            };
            targetKey = mapping[key] || key;
        }
        updateProperty(getPropertyKey(targetKey, activeStyleState, type), newValue);
    };

    return (
        <div className='background-popup-content'>
            <UnitInput
                label="Width" icon={icons.chevronDoubleRight} valKey="width" defaultUnit="%"
                vals={vals} handleChange={handleChange}
                disabled={isSectionType(type)}
            />
            <UnitInput
                label="Height" icon={icons.chevronDoubleUp} valKey="height" defaultUnit="px"
                vals={vals} handleChange={handleChange}
            />

            <div className="popup-divider" />

            <BoxSpacingControls label="Padding" propKey="padding" icon={icons.square} vals={vals} handleChange={handleChange} />

            <div className="popup-divider" />

            <BoxSpacingControls label="Margin" propKey="margin" icon={icons.maximize} vals={vals} handleChange={handleChange} />

            <div className="popup-divider" />

            <UnitInput
                label="Gap" icon={icons.columns} valKey="gap" defaultUnit="px"
                vals={vals} handleChange={handleChange}
            />

            <div className="popup-divider" />

            <div className='popup-input-item'>
                <div className='input-label'>Visibility:</div>
                <div style={{ display: 'flex', gap: '8px', padding: '0 12px' }}>
                    <button
                        className={`popup-toolbar-btn ${vals.hideDesktop ? 'disabled' : ''}`}
                        onClick={() => updateProperty('hideDesktop', !vals.hideDesktop)}
                        title={vals.hideDesktop ? 'Show on Desktop' : 'Hide on Desktop'}
                    >
                        <Icon icon={icons.monitor} size={16} style={{ opacity: vals.hideDesktop ? 0.4 : 1 }} />
                    </button>
                    <button
                        className={`popup-toolbar-btn ${vals.hideTablet ? 'disabled' : ''}`}
                        onClick={() => updateProperty('hideTablet', !vals.hideTablet)}
                        title={vals.hideTablet ? 'Show on Tablet' : 'Hide on Tablet'}
                    >
                        <Icon icon={icons.tablet} size={16} style={{ opacity: vals.hideTablet ? 0.4 : 1 }} />
                    </button>
                    <button
                        className={`popup-toolbar-btn ${vals.hideMobile ? 'disabled' : ''}`}
                        onClick={() => updateProperty('hideMobile', !vals.hideMobile)}
                        title={vals.hideMobile ? 'Show on Mobile' : 'Hide on Mobile'}
                    >
                        <Icon icon={icons.smartphone} size={16} style={{ opacity: vals.hideMobile ? 0.4 : 1 }} />
                    </button>
                </div>
            </div>
        </div>
    );
};


/**
 * Content for the Background & Style Popup Menu
 */
const BackgroundControls = ({ updateProperty, type }) => {
    const { view, selectedElement, activeStyleState } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const getValues = () => {
        const getVal = (baseKey) => {
            const stateKey = getPropertyKey(baseKey, activeStyleState, type);
            if (isSectionType(type)) {
                const settings = data.settings || {};
                const mobile = settings.responsive?.mobile || {};
                const tablet = settings.responsive?.tablet || {};
                if (view === 'mobile') return mobile[stateKey] || tablet[stateKey] || settings[stateKey];
                if (view === 'tablet') return tablet[stateKey] || settings[stateKey];
                return settings[stateKey];
            } else {
                const props = data.properties || {};
                const mobile = data.responsive?.mobile?.properties || {};
                const tablet = data.responsive?.tablet?.properties || {};
                if (view === 'mobile') return mobile[stateKey] || tablet[stateKey] || props[stateKey];
                if (view === 'tablet') return tablet[stateKey] || props[stateKey];
                return props[stateKey];
            }
        };
        return {
            bgColor: getVal(type === 'block' ? 'bg-color' : 'bgColor'),
            bgImage: getVal(type === 'block' ? 'bg-image' : 'bgImage'),
            bgPosition: getVal(type === 'block' ? 'bg-position' : 'bgPosition'),
            bgRepeat: getVal(type === 'block' ? 'bg-repeat' : 'bgRepeat'),
            bgSize: getVal(type === 'block' ? 'bg-size' : 'bgSize'),
            overlayColor: getVal(type === 'block' ? 'overlay-color' : 'overlayColor'),
            overlayOpacity: getVal(type === 'block' ? 'overlay-opacity' : 'overlayOpacity'),
        };
    };

    const vals = getValues();

    const handleChange = (key, value) => {
        let targetKey = key;
        if (type === 'block') {
            const mapping = {
                bgColor: 'bg-color',
                bgImage: 'bg-image',
                bgPosition: 'bg-position',
                bgRepeat: 'bg-repeat',
                bgSize: 'bg-size',
                overlayColor: 'overlay-color',
                overlayOpacity: 'overlay-opacity',
            };
            targetKey = mapping[key] || key;
        }

        // Default to black if opacity is changed and no color is set
        if (key === 'overlayOpacity' && !vals.overlayColor) {
            const colorKey = type === 'block' ? 'overlay-color' : 'overlayColor';
            updateProperty(getPropertyKey(colorKey, activeStyleState, type), '#000000');
        }

        updateProperty(getPropertyKey(targetKey, activeStyleState, type), value);
    };

    return (
        <div className="background-popup-content">
            {/* Background Color */}
            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.droplet} />Background</div>
                <div className='color-picker-wrapper'>
                    <input type='color' value={vals.bgColor || '#ffffff'} onChange={(e) => handleChange('bgColor', e.target.value)} />
                    <span className='color-value-text'>{vals.bgColor || '#ffffff'}</span>
                    {vals.bgColor && (
                        <button className='color-reset-btn' onClick={() => handleChange('bgColor', '')} title="Clear color">
                            <Icon icon={icons.times} />
                        </button>
                    )}
                </div>
            </div>

            {/* Background Image URL */}
            <div className='popup-input-item' style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                <div className='input-label'><Icon icon={icons.image} /> Image URL</div>
                <input type='text' name='photoBg' placeholder='https://...' style={{ width: '100%' }} value={vals.bgImage || ''} autoComplete="off" onChange={(e) => handleChange('bgImage', e.target.value)} />
            </div>

            <div className="popup-divider" />

            {/* Advanced Properties */}
            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.mousePointer} /> Position</div>
                <select name='photoPosition' value={vals.bgPosition || 'center'} onChange={(e) => handleChange('bgPosition', e.target.value)}>
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="top left">Top Left</option>
                    <option value="top right">Top Right</option>
                    <option value="bottom left">Bottom Left</option>
                    <option value="bottom right">Bottom Right</option>
                </select>
            </div>

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.repeat} /> Repeat</div>
                <select name='photoRepeat' value={vals.bgRepeat || 'no-repeat'} onChange={(e) => handleChange('bgRepeat', e.target.value)}>
                    <option value="no-repeat">No Repeat</option>
                    <option value="repeat">Repeat All</option>
                    <option value="repeat-x">Repeat X</option>
                    <option value="repeat-y">Repeat Y</option>
                </select>
            </div>

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.maximize} /> Size</div>
                <select name='photoSize' value={vals.bgSize || 'cover'} onChange={(e) => handleChange('bgSize', e.target.value)}>
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="auto">Auto</option>
                </select>
            </div>

            <div className="popup-divider" />

            {/* Overlay Group */}
            <div className="popup-input-item">
                <div className='input-label'><Icon icon={icons.layers} /> Overlay</div>
                <div className="color-picker-wrapper">
                    <input name='photoOverlayColor' type="color" value={vals.overlayColor || '#000000'} onChange={(e) => handleChange('overlayColor', e.target.value)} />
                    <span className="color-value-text">{vals.overlayColor || '#000000'}</span>
                    {vals.overlayColor && (
                        <button className='color-reset-btn' onClick={() => handleChange('overlayColor', '')} title="Clear color">
                            <Icon icon={icons.times} />
                        </button>
                    )}
                </div>
            </div>

            <div className="popup-input-item slider-item">
                <input name='photoOverlayOpacity' type="range" min="0" max="1" step="0.05" value={vals.overlayOpacity ?? 0} onChange={(e) => handleChange('overlayOpacity', parseFloat(e.target.value))} />
                <p>{Math.round((vals.overlayOpacity ?? 0) * 100)}%</p>
            </div>
        </div>
    );
};

/**
 * Content for the Typography Popup Menu
 */
const TypographyControls = ({ updateProperty, type }) => {
    const { view, selectedElement, activeStyleState } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const getValues = () => {
        const getVal = (baseKey) => {
            const stateKey = getPropertyKey(baseKey, activeStyleState, type);
            if (isSectionType(type)) {
                const settings = data.settings || {};
                const mobile = settings.responsive?.mobile || {};
                const tablet = settings.responsive?.tablet || {};
                if (view === 'mobile') return mobile[stateKey] || tablet[stateKey] || settings[stateKey];
                if (view === 'tablet') return tablet[stateKey] || settings[stateKey];
                return settings[stateKey];
            } else {
                const props = data.properties || {};
                const mobile = data.responsive?.mobile?.properties || {};
                const tablet = data.responsive?.tablet?.properties || {};
                if (view === 'mobile') return mobile[stateKey] || tablet[stateKey] || props[stateKey];
                if (view === 'tablet') return tablet[stateKey] || props[stateKey];
                return props[stateKey];
            }
        };
        return {
            fontSize: getVal(type === 'block' ? 'font-size' : 'fontSize'),
            fontWeight: getVal(type === 'block' ? 'font-weight' : 'fontWeight'),
            fontStyle: getVal(type === 'block' ? 'font-style' : 'fontStyle'),
            textDecoration: getVal(type === 'block' ? 'text-decoration' : 'textDecoration'),
            color: getVal('color'),
        };
    };

    const vals = getValues();

    const handleChange = (key, value) => {
        let targetKey = key;
        if (isSectionType(type)) {
            const mapping = {
                'font-size': 'fontSize',
                'font-weight': 'fontWeight',
                'font-style': 'fontStyle',
                'text-decoration': 'textDecoration',
                'color': 'color'
            };
            targetKey = mapping[key] || key;
        }
        updateProperty(getPropertyKey(targetKey, activeStyleState, type), value);
    };

    const weights = [
        { label: 'Default', value: '' },
        { label: 'Thin (100)', value: '100' },
        { label: 'Light (300)', value: '300' },
        { label: 'Normal (400)', value: '400' },
        { label: 'Medium (500)', value: '500' },
        { label: 'Semi-Bold (600)', value: '600' },
        { label: 'Bold (700)', value: '700' },
        { label: 'Extra-Bold (800)', value: '800' },
        { label: 'Black (900)', value: '900' },
    ];

    return (
        <div className='background-popup-content'>
            <UnitInput label="Font Size" icon={icons.type} valKey="fontSize" defaultUnit="px" vals={{ fontSize: vals.fontSize }} handleChange={(key, num, unit) => handleChange('font-size', (unit === 'auto' || unit === 'inherit') ? unit : (num ? num + unit : ''))} />
            <div className='popup-divider' />
            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.bold} /> Weight</div>
                <select name='sb_fontWeight' value={vals.fontWeight || ''} onChange={(e) => handleChange('font-weight', e.target.value)}>
                    {weights.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
            </div>
            <div className='popup-divider' />
            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.italic} /> Italic</div>
                <div className='toggle-switch small'>
                    <label>
                        <input
                            name='cb_fontStyle'
                            type='checkbox'
                            checked={vals.fontStyle === 'italic'}
                            onChange={(e) => handleChange('font-style', e.target.checked ? 'italic' : 'normal')}
                        />
                        <span></span>
                    </label>
                </div>
            </div>
            <div className='popup-divider' />
            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.underline} /> Underline</div>
                <div className='toggle-switch small'>
                    <label>
                        <input
                            name='cb_textDecoration'
                            type='checkbox'
                            checked={vals.textDecoration === 'underline'}
                            onChange={(e) => handleChange('text-decoration', e.target.checked ? 'underline' : 'none')}
                        />
                        <span></span>
                    </label>
                </div>
            </div>
            <div className='popup-divider' />
            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.droplet} /> Text Color</div>
                <div className='color-picker-wrapper'>
                    <input type='color' value={vals.color || '#333333'} onChange={(e) => handleChange('color', e.target.value)} />
                    <p className='color-value-text'>{vals.color || 'Default'}</p>
                    <button className='color-reset-btn' onClick={() => handleChange('color', '')} title="Clear color"><Icon icon={icons.times} /></button>
                </div>
            </div>
        </div>
    );
};

/**
 * Content for the Border Popup Menu
 */
const BorderControls = ({ updateProperty, type }) => {
    const { view, selectedElement, activeStyleState } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const getValues = () => {
        const getVal = (baseKey) => {
            const stateKey = getPropertyKey(baseKey, activeStyleState, type);
            if (isSectionType(type)) {
                const settings = data.settings || {};
                const mobile = settings.responsive?.mobile || {};
                const tablet = settings.responsive?.tablet || {};
                if (view === 'mobile') return mobile[stateKey] || tablet[stateKey] || settings[stateKey];
                if (view === 'tablet') return tablet[stateKey] || settings[stateKey];
                return settings[stateKey];
            } else {
                const props = data.properties || {};
                const mobile = data.responsive?.mobile?.properties || {};
                const tablet = data.responsive?.tablet?.properties || {};
                if (view === 'mobile') return mobile[stateKey] || tablet[stateKey] || props[stateKey];
                if (view === 'tablet') return tablet[stateKey] || props[stateKey];
                return props[stateKey];
            }
        };
        return {
            borderWidth: getVal(type === 'block' ? 'border-width' : 'borderWidth'),
            borderStyle: getVal(type === 'block' ? 'border-style' : 'borderStyle'),
            borderColor: getVal(type === 'block' ? 'border-color' : 'borderColor'),
            borderRadius: getVal(type === 'block' ? 'border-radius' : 'borderRadius') || (selectedElement?.data?.properties?.className?.includes('card-case') ? '12px' : ''),
        };
    };

    const vals = getValues();

    const handleChange = (key, value) => {
        let targetKey = key;
        if (type === 'block') {
            const mapping = {
                borderWidth: 'border-width',
                borderStyle: 'border-style',
                borderColor: 'border-color',
                borderRadius: 'border-radius',
            };
            targetKey = mapping[key] || key;
        }
        updateProperty(getPropertyKey(targetKey, activeStyleState, type), value);
    };

    const borderStyles = [
        { label: 'None', value: 'none' },
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Double', value: 'double' },
        { label: 'Groove', value: 'groove' },
        { label: 'Ridge', value: 'ridge' },
        { label: 'Inset', value: 'inset' },
        { label: 'Outset', value: 'outset' },
    ];

    return (
        <div className='background-popup-content'>
            <BoxSpacingControls
                label="Width" propKey="borderWidth" icon={icons.maximize}
                vals={{ borderWidth: vals.borderWidth }}
                handleChange={(key, val) => handleChange('borderWidth', val)}
            />

            <div className='popup-divider' />

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.repeat} /> Style</div>
                <select name='tt_BorderStyle' value={vals.borderStyle || 'solid'} onChange={(e) => handleChange('borderStyle', e.target.value)}>
                    {borderStyles.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>

            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.droplet} /> Color</div>
                <div className='color-picker-wrapper'>
                    <input type='color' value={vals.borderColor || '#000000'} onChange={(e) => handleChange('borderColor', e.target.value)} />
                    <p className='color-value-text'>{vals.borderColor || '#000000'}</p>
                    {vals.borderColor && (
                        <button className='color-reset-btn' onClick={() => handleChange('borderColor', '')} title="Clear color">
                            <Icon icon={icons.times} />
                        </button>
                    )}
                </div>
            </div>

            <div className="popup-divider" />

            <UnitInput
                label="Radius" icon={icons.squareCheck} valKey="borderRadius" defaultUnit="px"
                vals={{ borderRadius: vals.borderRadius }}
                handleChange={(key, num, unit) => handleChange('borderRadius', (unit === 'auto' || unit === 'inherit') ? unit : (num ? num + unit : ''))}
            />
        </div>
    );
};

/**
 * Content for the Layout & Alignment Popup Menu
 */
const AlignmentControls = ({ updateProperty, type }) => {
    const { view, selectedElement, activeStyleState } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const isTextOrButton = selectedElement?.type === 'button' || selectedElement?.type === 'text' || selectedElement?.type === 'richtext';

    const getValues = () => {
        if (isSectionType(type)) {
            const settings = data.settings || {};
            const mobile = settings.responsive?.mobile || {};
            const tablet = settings.responsive?.tablet || {};
            const resolve = (key) => {
                if (view === 'mobile') return mobile[key] || tablet[key] || settings[key];
                if (view === 'tablet') return tablet[key] || settings[key];
                return settings[key];
            };
            return {
                direction: resolve('flexDirection'),
                alignItems: resolve('alignItems'),
                justifyContent: resolve('justifyContent'),
                textAlign: '',
            };
        } else {
            const props = data.properties || {};
            const mobile = data.responsive?.mobile?.properties || {};
            const tablet = data.responsive?.tablet?.properties || {};
            const resolve = (key) => {
                if (view === 'mobile') return mobile[key] || tablet[key] || props[key];
                if (view === 'tablet') return tablet[key] || props[key];
                return props[key];
            };
            return {
                direction: resolve('flex-direction'),
                alignItems: resolve('align-items'),
                justifyContent: resolve('justify-content'),
                textAlign: resolve('text-align'),
            };
        }
    };

    const vals = getValues();
    let direction = vals.direction || '';
    if (!direction && selectedElement?.data?.properties?.className?.includes('card-case')) {
        direction = 'column';
    }
    const align = vals.alignItems || '';
    const justify = vals.justifyContent || '';
    const textAlign = vals.textAlign || '';

    const handleChange = (key, value) => {
        let targetKey = key;
        if (type === 'block') {
            const mapping = {
                direction: 'flex-direction',
                alignItems: 'align-items',
                justifyContent: 'justify-content',
                textAlign: 'text-align'
            };
            targetKey = mapping[key] || key;
        } else if (isSectionType(type)) {
            const mapping = {
                direction: 'flexDirection',
                alignItems: 'alignItems',
                justifyContent: 'justifyContent',
            };
            targetKey = mapping[key] || key;
        }
        updateProperty(getPropertyKey(targetKey, activeStyleState, type), value);
    };

    // Text & Button Text-align list
    if (isTextOrButton) {
        const textOptions = [
            { label: 'Align Left', value: 'left', icon: icons.alignLeft },
            { label: 'Align Center', value: 'center', icon: icons.alignCenter },
            { label: 'Align Right', value: 'right', icon: icons.alignRight },
        ];
        return (
            <div className='popup-tag-content' style={{ width: '170px' }}>
                {textOptions.map(opt => (
                    <div
                        key={opt.value}
                        className={`popup-tag-item ${textAlign === opt.value ? 'selected' : ''}`}
                        onClick={() => handleChange('textAlign', opt.value)}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Icon icon={opt.icon} size={12} />
                            <span>{opt.label}</span>
                        </span>
                        {textAlign === opt.value && <Icon icon={icons.check} size={12} />}
                    </div>
                ))}
            </div>
        );
    }

    // Section vertical/horizontal layout list
    if (isSectionType(type)) {
        const dirOptions = [
            { label: 'Row (Horizontal)', value: 'row', icon: icons.columns },
            { label: 'Column (Vertical)', value: 'column', icon: icons.layers },
        ];
        const alignOptions = [
            { label: direction === 'column' ? 'Align Left' : 'Align Top', value: 'flex-start', icon: direction === 'column' ? icons.alignLeft : icons.alignStartVertical },
            { label: 'Align Center', value: 'center', icon: direction === 'column' ? icons.alignCenter : icons.alignCenterVertical },
            { label: direction === 'column' ? 'Align Right' : 'Align Bottom', value: 'flex-end', icon: direction === 'column' ? icons.alignRight : icons.alignEndVertical },
            { label: 'Stretch', value: 'stretch', icon: icons.maximize },
        ];
        const justifyOptions = [
            { label: direction === 'column' ? 'Justify Top' : 'Justify Left', value: 'flex-start', icon: direction === 'column' ? icons.alignStartVertical : icons.alignLeft },
            { label: 'Justify Center', value: 'center', icon: direction === 'column' ? icons.alignCenterVertical : icons.alignCenter },
            { label: direction === 'column' ? 'Justify Bottom' : 'Justify Right', value: 'flex-end', icon: direction === 'column' ? icons.alignEndVertical : icons.alignRight },
            { label: 'Space Between', value: 'space-between', icon: icons.alignJustify },
        ];
        return (
            <div className='popup-tag-content' style={{ width: '190px' }}>
                {selectedElement?.type !== 'nav' && (
                    <>
                        <div style={{ padding: '6px 12px 4px', fontSize: '10px', color: 'var(--cms-color-text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>DIRECTION</div>
                        {dirOptions.map(opt => (
                            <div
                                key={opt.value}
                                className={`popup-tag-item ${direction === opt.value ? 'selected' : ''}`}
                                onClick={() => handleChange('direction', opt.value)}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <Icon icon={opt.icon} size={12} />
                                    <span>{opt.label}</span>
                                </span>
                                {direction === opt.value && <Icon icon={icons.check} size={12} />}
                            </div>
                        ))}
                        <div className='popup-divider' style={{ margin: '4px 0' }} />
                    </>
                )}
                <div style={{ padding: '6px 12px 4px', fontSize: '10px', color: 'var(--cms-color-text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>ALIGN ITEMS</div>
                {alignOptions.map(opt => (
                    <div
                        key={opt.value}
                        className={`popup-tag-item ${align === opt.value ? 'selected' : ''}`}
                        onClick={() => handleChange('alignItems', opt.value)}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Icon icon={opt.icon} size={12} />
                            <span>{opt.label}</span>
                        </span>
                        {align === opt.value && <Icon icon={icons.check} size={12} />}
                    </div>
                ))}
                <div className='popup-divider' style={{ margin: '4px 0' }} />
                <div style={{ padding: '6px 12px 4px', fontSize: '10px', color: 'var(--cms-color-text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>JUSTIFY CONTENT</div>
                {justifyOptions.map(opt => (
                    <div
                        key={opt.value}
                        className={`popup-tag-item ${justify === opt.value ? 'selected' : ''}`}
                        onClick={() => handleChange('justifyContent', opt.value)}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Icon icon={opt.icon} size={12} />
                            <span>{opt.label}</span>
                        </span>
                        {justify === opt.value && <Icon icon={icons.check} size={12} />}
                    </div>
                ))}
            </div>
        );
    }

    // Container block settings list
    if (selectedElement?.type === 'container') {
        const dirOptions = [
            { label: 'Row (Horizontal)', value: 'row', icon: icons.columns },
            { label: 'Column (Vertical)', value: 'column', icon: icons.layers },
        ];
        const alignOptions = [
            { label: direction === 'column' ? 'Align Left' : 'Align Top', value: 'flex-start', icon: direction === 'column' ? icons.alignLeft : icons.alignStartVertical },
            { label: 'Align Center', value: 'center', icon: direction === 'column' ? icons.alignCenter : icons.alignCenterVertical },
            { label: direction === 'column' ? 'Align Right' : 'Align Bottom', value: 'flex-end', icon: direction === 'column' ? icons.alignRight : icons.alignEndVertical },
            { label: 'Stretch', value: 'stretch', icon: icons.maximize },
        ];
        const justifyOptions = [
            { label: direction === 'column' ? 'Justify Top' : 'Justify Left', value: 'flex-start', icon: direction === 'column' ? icons.alignStartVertical : icons.alignLeft },
            { label: 'Justify Center', value: 'center', icon: direction === 'column' ? icons.alignCenterVertical : icons.alignCenter },
            { label: direction === 'column' ? 'Justify Bottom' : 'Justify Right', value: 'flex-end', icon: direction === 'column' ? icons.alignEndVertical : icons.alignRight },
            { label: 'Space Between', value: 'space-between', icon: icons.alignJustify },
        ];
        return (
            <div className='popup-tag-content' style={{ width: '210px' }}>
                <div style={{ padding: '6px 12px 4px', fontSize: '10px', color: 'var(--cms-color-text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>DIRECTION</div>
                {dirOptions.map(opt => (
                    <div
                        key={opt.value}
                        className={`popup-tag-item ${direction === opt.value ? 'selected' : ''}`}
                        onClick={() => handleChange('direction', opt.value)}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Icon icon={opt.icon} size={12} />
                            <span>{opt.label}</span>
                        </span>
                        {direction === opt.value && <Icon icon={icons.check} size={12} />}
                    </div>
                ))}
                <div className='popup-divider' style={{ margin: '4px 0' }} />
                <div style={{ padding: '6px 12px 4px', fontSize: '10px', color: 'var(--cms-color-text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>ALIGN ITEMS</div>
                {alignOptions.map(opt => (
                    <div
                        key={opt.value}
                        className={`popup-tag-item ${align === opt.value ? 'selected' : ''}`}
                        onClick={() => handleChange('alignItems', opt.value)}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Icon icon={opt.icon} size={12} />
                            <span>{opt.label}</span>
                        </span>
                        {align === opt.value && <Icon icon={icons.check} size={12} />}
                    </div>
                ))}
                <div className='popup-divider' style={{ margin: '4px 0' }} />
                <div style={{ padding: '6px 12px 4px', fontSize: '10px', color: 'var(--cms-color-text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>JUSTIFY CONTENT</div>
                {justifyOptions.map(opt => (
                    <div
                        key={opt.value}
                        className={`popup-tag-item ${justify === opt.value ? 'selected' : ''}`}
                        onClick={() => handleChange('justifyContent', opt.value)}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Icon icon={opt.icon} size={12} />
                            <span>{opt.label}</span>
                        </span>
                        {justify === opt.value && <Icon icon={icons.check} size={12} />}
                    </div>
                ))}
            </div>
        );
    }

    return null;
};/**
 * Content for the Box Shadow Popup Menu
 */
const ShadowControls = ({ updateProperty, type }) => {
    const { view, selectedElement, activeStyleState } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const getValues = () => {
        const getVal = (baseKey) => {
            const stateKey = getPropertyKey(baseKey, activeStyleState, type);
            if (isSectionType(type)) {
                const settings = data.settings || {};
                const mobile = settings.responsive?.mobile || {};
                return view === 'mobile' ? (mobile[stateKey] || settings[stateKey]) : settings[stateKey];
            } else {
                const props = data.properties || {};
                const mobile = data.responsive?.mobile?.properties || {};
                return view === 'mobile' ? (mobile[stateKey] || props[stateKey]) : props[stateKey];
            }
        };
        return {
            boxShadow: getVal(type === 'block' ? 'box-shadow' : 'boxShadow') || (selectedElement?.data?.properties?.className?.includes('card-case') ? '0px 0px 15px 0px #d8d0d0' : ''),
        };
    };

    const vals = getValues();

    const parseBoxShadow = (val) => {
        if (!val) return { x: '0px', y: '0px', blur: '0px', spread: '0px', color: '#000000' };
        // Match: offset-x offset-y blur-radius spread-radius color
        const parts = val.match(/^(-?\d+(?:\.\d+)?(?:px|%|em|rem)?)\s+(-?\d+(?:\.\d+)?(?:px|%|em|rem)?)\s+(-?\d+(?:\.\d+)?(?:px|%|em|rem)?)\s+(-?\d+(?:\.\d+)?(?:px|%|em|rem)?)\s+(.+)$/);
        if (parts) return { x: parts[1] || '0px', y: parts[2] || '0px', blur: parts[3] || '0px', spread: parts[4] || '0px', color: parts[5].trim() };
        return { x: '0px', y: '0px', blur: '0px', spread: '0px', color: '#000000' };
    };

    const shadow = parseBoxShadow(vals.boxShadow);

    const handleChange = (field, value, unit) => {
        const current = { ...shadow };
        // Append unit if value is numeric and unit is provided
        let newVal = value;
        if (unit === 'auto' || unit === 'inherit') {
            newVal = unit;
        } else if (value && unit && value !== 'auto' && value !== 'inherit') {
            newVal = value + unit;
        }
        current[field] = newVal;
        const newShadow = `${current.x} ${current.y} ${current.blur} ${current.spread} ${current.color}`.trim();

        let targetKey = type === 'block' ? 'box-shadow' : 'boxShadow';
        updateProperty(getPropertyKey(targetKey, activeStyleState, type), newShadow);
    };

    const handleClear = () => {
        let targetKey = type === 'block' ? 'box-shadow' : 'boxShadow';
        updateProperty(getPropertyKey(targetKey, activeStyleState, type), '');
    };

    return (
        <div className='background-popup-content' >
            <UnitInput
                label="Offset-X" icon={icons.chevronDoubleRight} valKey="x" defaultUnit="px"
                vals={shadow} handleChange={handleChange}
            />
            <UnitInput
                label="Offset-Y" icon={icons.chevronDoubleUp} valKey="y" defaultUnit="px"
                vals={shadow} handleChange={handleChange}
            />
            <UnitInput
                label="Blur" icon={icons.circle} valKey="blur" defaultUnit="px"
                vals={shadow} handleChange={handleChange}
            />
            <UnitInput
                label="Spread" icon={icons.maximize} valKey="spread" defaultUnit="px"
                vals={shadow} handleChange={handleChange}
            />
            <div className="popup-divider" />
            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.droplet} /> Color</div>
                <div className='color-picker-wrapper'>
                    <input type='color' value={shadow.color || '#000000'} onChange={(e) => handleChange('color', e.target.value)} />
                    <span className='color-value-text'>{shadow.color || '#000000'}</span>
                    {vals.boxShadow && (
                        <button className='color-reset-btn' onClick={handleClear} title="Clear shadow">
                            <Icon icon={icons.times} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Content for the Interaction States Popup Menu
 */
/**
 * Content for the Transitions & Effects Popup Menu
 */
const EffectsControls = ({ updateProperty, type }) => {
    const { view, selectedElement, activeStyleState } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const getVal = (baseKey) => {
        const stateKey = getPropertyKey(baseKey, activeStyleState, type);
        if (type === 'block') {
            const props = data.properties || {};
            const mobileProps = data.responsive?.mobile?.properties || {};
            const tabletProps = data.responsive?.tablet?.properties || {};
            if (view === 'mobile') return mobileProps[stateKey] !== undefined ? mobileProps[stateKey] : (tabletProps[stateKey] !== undefined ? tabletProps[stateKey] : props[stateKey]);
            if (view === 'tablet') return tabletProps[stateKey] !== undefined ? tabletProps[stateKey] : props[stateKey];
            return props[stateKey];
        } else {
            const settings = data.settings || {};
            const mobileSettings = settings.responsive?.mobile || {};
            const tabletSettings = settings.responsive?.tablet || {};
            if (view === 'mobile') return mobileSettings[stateKey] !== undefined ? mobileSettings[stateKey] : (tabletSettings[stateKey] !== undefined ? tabletSettings[stateKey] : settings[stateKey]);
            if (view === 'tablet') return tabletSettings[stateKey] !== undefined ? tabletSettings[stateKey] : settings[stateKey];
            return settings[stateKey];
        }
    };

    const transition = getVal('transition') || '';
    const hoverScale = getVal(type === 'block' ? 'hover-scale' : 'hoverScale') || '';

    const handleTransitionChange = (value) => {
        updateProperty(getPropertyKey(type === 'block' ? 'transition' : 'transition', activeStyleState, type), value);
    };

    const handleZoomChange = (checked) => {
        updateProperty(getPropertyKey(type === 'block' ? 'hover-scale' : 'hoverScale', activeStyleState, type), checked ? 'zoom' : '');
    };

    const transitionOptions = [
        { label: 'None', value: '' },
        { label: 'Fast (0.1s)', value: 'all 0.1s ease' },
        { label: 'Smooth (0.2s)', value: 'all 0.2s ease' },
        { label: 'Normal (0.3s)', value: 'all 0.3s ease' },
        { label: 'Deliberate (0.5s)', value: 'all 0.5s ease' },
        { label: 'Slow (0.8s)', value: 'all 0.8s ease' },
    ];

    const isCustomTransition = transition && !transitionOptions.some(opt => opt.value === transition);

    return (
        <div className="background-popup-content" style={{ width: '250px' }}>
            {/* Transition Duration */}
            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.rotate} /> Transition</div>
                <select name='cb_transition' value={isCustomTransition ? 'custom' : transition}
                    onChange={(e) => {
                        if (e.target.value === 'custom') {
                            handleTransitionChange('all 0.4s ease');
                        } else {
                            handleTransitionChange(e.target.value);
                        }
                    }}
                >
                    {transitionOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                    <option value="custom">Custom...</option>
                </select>
            </div>

            {isCustomTransition && (
                <div className='popup-input-item' style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                    <div className='input-label'>Custom Transition Value</div>
                    <input
                        type="text"
                        placeholder="e.g. all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ width: '100%' }}
                        value={transition}
                        onChange={(e) => handleTransitionChange(e.target.value)}
                    />
                </div>
            )}

            <div className="popup-divider" />

            {/* Zoom / Micro-animation Switch */}
            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.maximize} /> Zoom on Hover</div>
                <div className='toggle-switch small'>
                    <label>
                        <input
                            name='cb_hoverScale'
                            type='checkbox'
                            checked={hoverScale === 'zoom'}
                            onChange={(e) => handleZoomChange(e.target.checked)}
                        />
                        <span></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

/**
 * Main Design Controls component for Toolbar
 */
const DesignControls = ({ data, updateProperty, type = 'block' }) => {
    const { openPopupMenu, closePopupMenu } = usePopupMenu();
    const { view, selectedElement, activeStyleState, setActiveStyleState } = useCMS();

    // Spacing, Typography, Background, Border, Shadow, Alignment, Effects change-detection helpers
    const getVal = (baseKey, state) => {
        const stateKey = getPropertyKey(baseKey, state, type);
        if (isSectionType(type)) {
            const settings = data.settings || {};
            const mobile = settings.responsive?.mobile || {};
            const tablet = settings.responsive?.tablet || {};
            if (view === 'mobile') return mobile[stateKey] !== undefined ? mobile[stateKey] : (tablet[stateKey] !== undefined ? tablet[stateKey] : settings[stateKey]);
            if (view === 'tablet') return tablet[stateKey] !== undefined ? tablet[stateKey] : settings[stateKey];
            return settings[stateKey];
        } else {
            const props = data.properties || {};
            const mobile = data.responsive?.mobile?.properties || {};
            const tablet = data.responsive?.tablet?.properties || {};
            if (view === 'mobile') return mobile[stateKey] !== undefined ? mobile[stateKey] : (tablet[stateKey] !== undefined ? tablet[stateKey] : props[stateKey]);
            if (view === 'tablet') return tablet[stateKey] !== undefined ? tablet[stateKey] : props[stateKey];
            return props[stateKey];
        }
    };

    const hasChangesForKeys = (keys) => {
        if (!data) return false;
        const states = ['normal', 'hover', 'active', 'focus'];
        for (const state of states) {
            for (const key of keys) {
                const val = getVal(key, state);
                if (val !== undefined && val !== null && val !== '') {
                    // Check standard default value bypasses to avoid highlighting unchanged default values
                    if ((key === 'bgPosition' || key === 'bg-position') && val === 'center') continue;
                    if ((key === 'bgRepeat' || key === 'bg-repeat') && val === 'no-repeat') continue;
                    if ((key === 'bgSize' || key === 'bg-size') && val === 'cover') continue;
                    if ((key === 'overlayOpacity' || key === 'overlay-opacity') && parseFloat(val) === 0) continue;
                    if ((key === 'borderStyle' || key === 'border-style') && (val === 'solid' || val === 'none')) continue;
                    return true;
                }
            }
        }
        return false;
    };

    const hasVisibilityChanges = () => {
        if (isSectionType(type)) {
            const settings = selectedElement?.data?.settings || {};
            return settings.hideDesktop || settings.hideTablet || settings.hideMobile;
        } else {
            const props = selectedElement?.data?.properties || {};
            return props.hideDesktop || props.hideTablet || props.hideMobile;
        }
    };

    const hasSpacingChanges = () => {
        const keys = isSectionType(type)
            ? ['height', 'padding', 'margin', 'gap']
            : ['width', 'height', 'padding', 'margin', 'gap'];
        return hasChangesForKeys(keys) || hasVisibilityChanges();
    };

    const hasTypographyChanges = () => {
        const keys = isSectionType(type)
            ? ['fontSize', 'fontWeight', 'fontStyle', 'textDecoration', 'color']
            : ['font-size', 'font-weight', 'font-style', 'text-decoration', 'color'];
        return hasChangesForKeys(keys);
    };

    const hasBackgroundChanges = () => {
        const keys = isSectionType(type)
            ? ['bgColor', 'bgImage', 'bgPosition', 'bgRepeat', 'bgSize', 'overlayColor', 'overlayOpacity']
            : ['bg-color', 'bg-image', 'bg-position', 'bg-repeat', 'bg-size', 'overlay-color', 'overlay-opacity'];
        return hasChangesForKeys(keys);
    };

    const hasBorderChanges = () => {
        const keys = isSectionType(type)
            ? ['borderWidth', 'borderStyle', 'borderColor', 'borderRadius']
            : ['border-width', 'border-style', 'border-color', 'border-radius'];
        return hasChangesForKeys(keys);
    };

    const hasAlignmentChanges = () => {
        if (!data) return false;
        if (isSectionType(type)) {
            const keys = ['flexDirection', 'alignItems', 'justifyContent'];
            return hasChangesForKeys(keys);
        } else if (selectedElement?.type === 'container') {
            const keys = ['flex-direction', 'align-items', 'justify-content'];
            return hasChangesForKeys(keys);
        } else {
            const keys = ['text-align'];
            return hasChangesForKeys(keys);
        }
    };

    const hasShadowChanges = () => {
        const keys = isSectionType(type) ? ['boxShadow'] : ['box-shadow'];
        return hasChangesForKeys(keys);
    };

    const hasEffectsChanges = () => {
        const keys = isSectionType(type) ? ['transition', 'hoverScale'] : ['transition', 'hover-scale'];
        return hasChangesForKeys(keys);
    };

    const isFlexContainer = isSectionType(type) || selectedElement?.type === 'container';
    const isTextOrButton = selectedElement?.type === 'button' || selectedElement?.type === 'text' || selectedElement?.type === 'richtext';
    const hasAlignmentControls = isSectionType(type) || isFlexContainer || isTextOrButton;

    const hasColumnContext = selectedElement?.type === 'container'
        && selectedElement?.data?.properties?.className
        && (
            selectedElement.data.properties.className.includes('cms-cols-row')
            || selectedElement.data.properties.className === 'cms-col'
        );

    return (
        <>
            {/* State Selector Group */}
            <div className="toolbar-group state-selector-group">
                <button
                    className={`toolbar-btn state-selector-btn ${activeStyleState !== 'normal' ? 'state-active' : ''}`}
                    title="Active Style State"
                    onClick={(e) => openPopupMenu({
                        referenceElement: e.currentTarget,
                        content: (
                            <div className="popup-tag-content" style={{ width: '180px' }}>
                                <div style={{ padding: '6px 12px 4px', fontSize: '10px', color: 'var(--cms-color-text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>STYLE STATE</div>
                                {[
                                    { value: 'normal', label: 'Normal State', icon: icons.locateFixed, desc: 'Default styles' },
                                    { value: 'hover', label: 'Hover State', icon: icons.mousePointer, desc: 'Mouse hover styles' },
                                    { value: 'active', label: 'Active State', icon: icons.hand, desc: 'Click/press styles' },
                                    { value: 'focus', label: 'Focus State', icon: icons.key, desc: 'Input focus styles' }
                                ].map(state => (
                                    <div
                                        key={state.value}
                                        className={`popup-tag-item ${activeStyleState === state.value ? 'selected' : ''}`}
                                        onClick={() => {
                                            setActiveStyleState(state.value);
                                            closePopupMenu();
                                        }}
                                    >
                                        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                                                <Icon icon={state.icon} size={12} />
                                                <span>{state.label}</span>
                                            </span>
                                            <span style={{ fontSize: '9px', color: 'var(--cms-color-text-muted)', marginLeft: '20px' }}>{state.desc}</span>
                                        </span>
                                        {activeStyleState === state.value && <Icon icon={icons.check} size={12} />}
                                    </div>
                                ))}
                            </div>
                        ),
                        placement: 'bottom-start'
                    })}
                >
                    <Icon icon={
                        activeStyleState === 'hover' ? icons.mousePointer :
                            activeStyleState === 'active' ? icons.hand :
                                activeStyleState === 'focus' ? icons.key :
                                    icons.locateFixed
                    } size={14} />
                    <span style={{ marginLeft: '4px', marginRight: '2px', fontWeight: '600', textTransform: 'capitalize' }}>
                        {activeStyleState}
                    </span>
                    <Icon icon={icons.chevronDown} size={10} style={{ opacity: 0.5 }} />
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Layout/Spacing Group Trigger */}
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    title="Layout & Spacing"
                    onClick={(e) => openPopupMenu({
                        referenceElement: e.currentTarget,
                        content: <SpacingControls updateProperty={updateProperty} type={type} />,
                        placement: 'bottom-start'
                    })}
                >
                    <Icon icon={icons.layout} size={14} />
                    <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                    {hasSpacingChanges() && <span className="toolbar-btn-indicator" />}
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Typography Group Trigger */}
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    title="Typography"
                    onClick={(e) => openPopupMenu({
                        referenceElement: e.currentTarget,
                        content: <TypographyControls updateProperty={updateProperty} type={type} />,
                        placement: 'bottom-start'
                    })}
                >
                    <Icon icon={icons.type} size={14} />
                    <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                    {hasTypographyChanges() && <span className="toolbar-btn-indicator" />}
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Background & Style Popup Trigger */}
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    title="Background & Style"
                    onClick={(e) => openPopupMenu({
                        referenceElement: e.currentTarget,
                        content: <BackgroundControls updateProperty={updateProperty} type={type} />,
                        placement: 'bottom-start'
                    })}
                >
                    <Icon icon={icons.image} size={14} />
                    <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                    {hasBackgroundChanges() && <span className="toolbar-btn-indicator" />}
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Layout & Alignment Trigger (Centralized before Borders) */}
            {hasAlignmentControls && (
                <>
                    <div className="toolbar-group">
                        <button
                            className="toolbar-btn"
                            title="Layout & Alignment"
                            onClick={(e) => openPopupMenu({
                                referenceElement: e.currentTarget,
                                content: <AlignmentControls updateProperty={updateProperty} type={type} />,
                                placement: 'bottom-start'
                            })}
                        >
                            <Icon icon={icons.alignLeft} size={14} />
                            <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                            {hasAlignmentChanges() && <span className="toolbar-btn-indicator" />}
                        </button>
                    </div>
                    <div className="toolbar-divider" />
                </>
            )}

            {/* Columns Group Trigger (only for column rows/children) */}
            {hasColumnContext && (
                <>
                    <div className="toolbar-group">
                        <button
                            className="toolbar-btn"
                            title="Columns"
                            onClick={(e) => openPopupMenu({
                                referenceElement: e.currentTarget,
                                content: <ColumnControls updateProperty={updateProperty} type={type} />,
                                placement: 'bottom-start'
                            })}
                        >
                            <Icon icon={icons.columns} size={14} />
                            <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                        </button>
                    </div>
                    <div className="toolbar-divider" />
                </>
            )}

            {/* Border Group Trigger */}
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    title="Borders"
                    onClick={(e) => openPopupMenu({
                        referenceElement: e.currentTarget,
                        content: <BorderControls updateProperty={updateProperty} type={type} />,
                        placement: 'bottom-start'
                    })}
                >
                    <Icon icon={icons.layoutGrid} size={14} />
                    <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                    {hasBorderChanges() && <span className="toolbar-btn-indicator" />}
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Box Shadow Trigger */}
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    title="Box Shadow"
                    onClick={(e) => openPopupMenu({
                        referenceElement: e.currentTarget,
                        content: <ShadowControls updateProperty={updateProperty} type={type} />,
                        placement: 'bottom-start'
                    })}
                >
                    <Icon icon={icons.droplet} size={14} />
                    <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                    {hasShadowChanges() && <span className="toolbar-btn-indicator" />}
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Transitions & Effects Trigger */}
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    title="Transitions & Effects"
                    onClick={(e) => openPopupMenu({
                        referenceElement: e.currentTarget,
                        content: <EffectsControls updateProperty={updateProperty} type={type} />,
                        placement: 'bottom-start'
                    })}
                >
                    <Icon icon={icons.mousePointer} size={14} />
                    <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                    {hasEffectsChanges() && <span className="toolbar-btn-indicator" />}
                </button>
            </div>

            {/* Header/Footer Position Trigger (only for header & footer) */}
            {(type === 'header' || type === 'footer') && (
                <>
                    <div className="toolbar-divider" />
                    <div className="toolbar-group">
                        <button
                            className="toolbar-btn"
                            title="Position"
                            onClick={(e) => openPopupMenu({
                                referenceElement: e.currentTarget,
                                content: <PositionControls updateProperty={updateProperty} type={type} />,
                                placement: 'bottom-start'
                            })}
                        >
                            <Icon icon={icons.move} size={14} />
                            <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                        </button>
                    </div>
                </>
            )}

            {/* Block Order Trigger (for regular blocks) */}
            {type !== 'header' && type !== 'footer' && type !== 'section' && (
                <>
                    <div className="toolbar-divider" />
                    <div className="toolbar-group">
                        <button
                            className="toolbar-btn"
                            title="Block Order"
                            onClick={(e) => openPopupMenu({
                                referenceElement: e.currentTarget,
                                content: <OrderControls type={type} />,
                                placement: 'bottom-start'
                            })}
                        >
                            <Icon icon={icons.move} size={14} />
                            <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                        </button>
                    </div>
                </>
            )}
        </>
    );
};


/**
 * Content for the Header/Footer Position Popup Menu
 */
const PositionControls = ({ updateProperty, type }) => {
    const { view, selectedElement, activeStyleState } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const getValues = () => {
        if (isSectionType(type)) {
            const settings = data.settings || {};
            const mobile = settings.responsive?.mobile || {};
            const tablet = settings.responsive?.tablet || {};
            const resolve = (key) => {
                if (view === 'mobile') return mobile[key] || tablet[key] || settings[key];
                if (view === 'tablet') return tablet[key] || settings[key];
                return settings[key];
            };
            return {
                position: resolve('position'),
                top: resolve('top'),
                zIndex: resolve('zIndex'),
            };
        }
        return {};
    };

    const vals = getValues();

    const handleChange = (key, value) => {
        updateProperty(getPropertyKey(key, activeStyleState, type), value);
    };

    const positionOptions = [
        { label: 'Sticky (Default)', value: 'sticky' },
        { label: 'Fixed', value: 'fixed' },
        { label: 'Absolute', value: 'absolute' },
        { label: 'Static', value: 'static' },
    ];

    return (
        <div className="background-popup-content" style={{ width: '250px' }}>
            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.move} /> Position</div>
                <select name='tt_position'
                    value={vals.position || 'sticky'}
                    onChange={(e) => handleChange('position', e.target.value)}
                >
                    {positionOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="popup-divider" />

            <UnitInput
                label="Top Offset" icon={icons.chevronUp} valKey="top" defaultUnit="px"
                vals={{ top: vals.top }}
                handleChange={(key, num, unit) => handleChange('top', (unit === 'auto' || unit === 'inherit') ? unit : (num ? num + unit : ''))}
            />

            <div className="popup-divider" />

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.layers} /> Z-Index</div>
                <input name='tt_zIndex'
                    type="number"
                    placeholder="100"
                    style={{ width: '80px' }}
                    value={vals.zIndex || ''}
                    autoComplete="off"
                    onChange={(e) => handleChange('zIndex', e.target.value)}
                />
            </div>
        </div>
    );
};

/**
 * Content for the Columns Popup Menu (Add/Remove Columns)
 */
const ColumnControls = ({ updateProperty, type }) => {
    const { selectedElement, addColumnToRow, removeColumnFromRow } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    // Determine if we're on a column row itself or a child column
    const isRowDirect = data.properties?.className?.includes('cms-cols-row');
    const isColumnChild = data.properties?.className === 'cms-col';

    let rowBlockPath = selectedElement.id;
    let columnCount = 0;

    if (isRowDirect) {
        columnCount = data.blocks?.length || 0;
    } else if (isColumnChild) {
        // For child columns, the parent row path is one level up
        const indices = String(selectedElement.id).split('-').map(Number);
        const selectedColIndex = indices[indices.length - 1];
        rowBlockPath = indices.slice(0, -1).join('-');
        // Estimate column count based on index position (minimum)
        columnCount = selectedColIndex + 2;
    }

    const sectionId = selectedElement.sectionId || (selectedElement.type === 'footer' ? 'footer' : selectedElement.type === 'header' ? 'header' : null);
    const canRemove = columnCount > 1;

    const handleAddColumn = () => {
        if (!sectionId || !rowBlockPath) return;
        addColumnToRow(sectionId, rowBlockPath);
    };

    const handleRemoveColumn = () => {
        if (!sectionId || !selectedElement.id) return;
        if (!canRemove) return;
        const colPath = isRowDirect ? `${selectedElement.id}-${columnCount - 1}` : selectedElement.id;
        removeColumnFromRow(sectionId, colPath);
    };

    return (
        <div className='background-popup-content' style={{ width: '220px' }}>
            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.columns} /> Columns</div>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{columnCount}</span>
            </div>

            <div className="popup-divider" />

            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    className="button"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={handleAddColumn}
                    title="Add a column"
                >
                    <Icon icon={icons.add} size={14} /> Add
                </button>
                <button
                    className={`button ${!canRemove ? 'disabled' : ''}`}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={handleRemoveColumn}
                    disabled={!canRemove}
                    title={canRemove ? "Remove last column" : "Minimum 1 column required"}
                >
                    <Icon icon={icons.delete} size={14} /> Remove
                </button>
            </div>
        </div>
    );
};

/**
 * Content for the Order Popup Menu
 */
const OrderControls = ({ type }) => {
    const { selectedElement, moveBlock } = useCMS();

    if (!selectedElement || !selectedElement.id) return null;
    if (selectedElement.type === 'footer' || selectedElement.type === 'header' || selectedElement.type === 'section') return null;

    return (
        <div className="background-popup-content" style={{ width: '230px' }}>
            <div className='popup-input-item space-between'>
                <div className='input-label' style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Icon icon={icons.arrowUp} size={14} /> 
                    <Icon icon={icons.arrowLeft} size={14} /> 
                    <span>Move Up / Left</span>
                </div>
                <button 
                    className="button small" 
                    onClick={() => moveBlock(selectedElement.sectionId, selectedElement.id, 'up')}
                >
                    Move
                </button>
            </div>
            <div className="popup-divider" />
            <div className='popup-input-item space-between'>
                <div className='input-label' style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Icon icon={icons.arrowDown} size={14} /> 
                    <Icon icon={icons.arrowRight} size={14} /> 
                    <span>Move Down / Right</span>
                </div>
                <button 
                    className="button small" 
                    onClick={() => moveBlock(selectedElement.sectionId, selectedElement.id, 'down')}
                >
                    Move
                </button>
            </div>
        </div>
    );
};

export const LinkControls = ({ updateProperty }) => {
    const { view, selectedElement } = useCMS();
    const data = selectedElement.data;

    if (!data) return null;

    const getValues = () => {
        const props = data.properties || {};
        const mobile = data.responsive?.mobile?.properties || {};
        const tablet = data.responsive?.tablet?.properties || {};
        const resolve = (key) => {
            if (key === 'href' && selectedElement.type === 'nav-link') return data.url;
            if (view === 'mobile') return mobile[key] || tablet[key] || props[key];
            if (view === 'tablet') return tablet[key] || props[key];
            return props[key];
        };
        return {
            href: resolve('href'),
            target: resolve('target'),
            title: resolve('title'),
            ariaLabel: resolve('aria-label'),
        };
    };

    const vals = getValues();

    return (
        <div className='background-popup-content' style={{ width: '250px' }}>
            <div className='popup-input-item' style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                <div className='input-label'><Icon icon={icons.link} /> URL (href)</div>
                <input name='tt_linkURL'
                    type='text'
                    placeholder='https://...'
                    style={{ width: '100%' }}
                    value={vals.href || ''}
                    autoComplete="off"
                    onChange={(e) => updateProperty('href', e.target.value)}
                />
            </div>

            <div className='popup-divider' />

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.maximize} /> Open in New Tab</div>
                <select name='tt_linkTarget'
                    value={vals.target || '_self'}
                    onChange={(e) => updateProperty('target', e.target.value)}
                >
                    <option value='_self'>Same Window</option>
                    <option value='_blank'>New Tab</option>
                </select>
            </div>

            <div className='popup-divider' />

            <div className='popup-input-item' style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                <div className='input-label'><Icon icon={icons.info} /> Link Title (Tooltip)</div>
                <input name='tt_linkTitle'
                    type='text'
                    placeholder='Enter tooltip text...'
                    style={{ width: '100%' }}
                    value={vals.title || ''}
                    autoComplete="off"
                    onChange={(e) => updateProperty('title', e.target.value)}
                />
            </div>

            <div className='popup-input-item' style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                <div className='input-label'><Icon icon={icons.type} /> Aria Label (Accessibility)</div>
                <input name='tt_linkAriaLabel'
                    type='text'
                    placeholder='Descriptive label...'
                    style={{ width: '100%' }}
                    value={vals.ariaLabel || ''}
                    autoComplete="off"
                    onChange={(e) => updateProperty('aria-label', e.target.value)}
                />
            </div>
        </div>
    );
};

export default DesignControls;
