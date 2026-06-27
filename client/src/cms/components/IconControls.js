import React from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { useCMS } from '../../context/CMSContext';

export const IconControls = ({ updateProperty }) => {
    const { view, selectedElement } = useCMS();
    const data = selectedElement?.data;

    if (!data) return null;

    const getValues = () => {
        const props = data.properties || {};
        const mobile = data.responsive?.mobile?.properties || {};
        const tablet = data.responsive?.tablet?.properties || {};
        const resolve = (key) => {
            if (view === 'mobile') return mobile[key] || tablet[key] || props[key];
            if (view === 'tablet') return tablet[key] || props[key];
            return props[key];
        };
        return {
            size: resolve('size'),
            color: resolve('color'),
            hoverColor: resolve('hover-color'),
            hoverBgColor: resolve('hover-bg-color'),
            activeBgColor: resolve('active-bg-color'),
            hoverScale: resolve('hover-scale'),
        };
    };

    const vals = getValues();

    return (
        <div className='background-popup-content' style={{ width: '250px' }}>
            {/* Size Slider */}
            <div className='popup-input-item slider-item'>
                <div className='input-label' style={{ flexShrink: '0' }}>Icon Size</div>
                <input 
                    type="range" 
                    min="10" 
                    max="120" 
                    step="1" 
                    value={parseInt(vals.size || 24)} 
                    onChange={(e) => updateProperty('size', parseInt(e.target.value))} 
                />
                <p>{parseInt(vals.size || 24)}px</p>
            </div>

            {/* Color Picker */}
            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.droplet} /> Icon Color</div>
                <div className='color-picker-wrapper'>
                    <input 
                        type='color' 
                        value={vals.color || '#333333'} 
                        onChange={(e) => updateProperty('color', e.target.value)} 
                    />
                    <p className='color-value-text'>{vals.color || '#333333'}</p>
                    {vals.color && (
                        <button 
                            className='color-reset-btn' 
                            onClick={() => updateProperty('color', '')} 
                            title="Clear color"
                        >
                            <Icon icon={icons.times} />
                        </button>
                    )}
                </div>
            </div>

            <div className='popup-divider' />
            <div className='input-label' style={{ fontSize: '12px', opacity: 0.7 }}>Interaction States</div>

            {/* Hover Color */}
            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.type} /> Hover Color</div>
                <div className='color-picker-wrapper'>
                    <input 
                        type='color' 
                        value={vals.hoverColor || '#333333'} 
                        onChange={(e) => updateProperty('hover-color', e.target.value)} 
                    />
                    <p className='color-value-text'>{vals.hoverColor || 'Default'}</p>
                    {vals.hoverColor && (
                        <button 
                            className='color-reset-btn' 
                            onClick={() => updateProperty('hover-color', '')} 
                            title="Clear color"
                        >
                            <Icon icon={icons.times} />
                        </button>
                    )}
                </div>
            </div>

            {/* Hover BG */}
            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.mousePointer} /> Hover BG</div>
                <div className='color-picker-wrapper'>
                    <input 
                        type='color' 
                        value={vals.hoverBgColor || '#ffffff'} 
                        onChange={(e) => updateProperty('hover-bg-color', e.target.value)} 
                    />
                    <p className='color-value-text'>{vals.hoverBgColor || 'Theme'}</p>
                    {vals.hoverBgColor && (
                        <button 
                            className='color-reset-btn' 
                            onClick={() => updateProperty('hover-bg-color', '')} 
                            title="Clear color"
                        >
                            <Icon icon={icons.times} />
                        </button>
                    )}
                </div>
            </div>

            {/* Active BG */}
            <div className='popup-input-item'>
                <div className='input-label'><Icon icon={icons.mousePointer} /> Active BG</div>
                <div className='color-picker-wrapper'>
                    <input 
                        type='color' 
                        value={vals.activeBgColor || '#ffffff'} 
                        onChange={(e) => updateProperty('active-bg-color', e.target.value)} 
                    />
                    <p className='color-value-text'>{vals.activeBgColor || 'Theme'}</p>
                    {vals.activeBgColor && (
                        <button 
                            className='color-reset-btn' 
                            onClick={() => updateProperty('active-bg-color', '')} 
                            title="Clear color"
                        >
                            <Icon icon={icons.times} />
                        </button>
                    )}
                </div>
            </div>

            <div className='popup-divider' />

            {/* Hover Scale */}
            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.maximize} /> Zoom on Hover</div>
                <div className='toggle-switch radius'>
                    <label>
                        <input 
                            name='cb_hoverScale'
                            type='checkbox' 
                            checked={vals.hoverScale === 'zoom'} 
                            onChange={(e) => updateProperty('hover-scale', e.target.checked ? 'zoom' : '')} 
                        />
                        <span></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default IconControls;
