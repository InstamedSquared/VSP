import React from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { useCMS } from '../../context/CMSContext';
import IconPicker from './IconPicker';
import { usePopupMenu } from '../../context/PopupMenuContext';

export const ButtonControls = ({ updateProperty }) => {
    const { view, selectedElement } = useCMS();
    const { openPopupMenu, closePopupMenu } = usePopupMenu();
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
            iconGap: resolve('iconGap'),
            buttonStyle: resolve('button-style'),
            buttonVariant: resolve('button-variant'),
            buttonSize: resolve('button-size'),
            hoverBgColor: resolve('hover-bg-color'),
            hoverColor: resolve('hover-color'),
            activeBgColor: resolve('active-bg-color'),
        };
    };

    const vals = getValues();

    return (
        <div className='background-popup-content' style={{ width: '250px' }}>
            <div className='popup-input-item slider-item'>
                <div className='input-label' style={{ flexShrink: '0' }}>Icon Gap</div>
                <input type="range" min="0" max="50" step="1" value={parseInt(vals.iconGap || 0)} onChange={(e) => updateProperty('iconGap', e.target.value + 'px')} />
                <p>{parseInt(vals.iconGap || 0)}px</p>
            </div>

            <div className='popup-divider' />

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.droplet} /> Theme Style</div>
                <select name='btnStyle' value={vals.buttonStyle || ''} onChange={(e) => {
                    updateProperty('button-style', e.target.value);
                    if (e.target.value !== '') {
                        updateProperty('bg-color', '');
                        updateProperty('color', '');
                        updateProperty('hover-bg-color', '');
                        updateProperty('hover-color', '');
                        updateProperty('active-bg-color', '');
                    }
                }}>
                    <option value=''>Default</option>
                    <option value='btn-primary'>Primary</option>
                    <option value='btn-secondary'>Secondary</option>
                    <option value='btn-success'>Success</option>
                    <option value='btn-outlined'>Outlined</option>
                    <option value='btn-info'>Info</option>
                    <option value='btn-warning'>Warning</option>
                    <option value='btn-danger'>Danger</option>
                    <option value='btn-focus'>Focus</option>
                    <option value='btn-alt'>Alt</option>
                    <option value='btn-light'>Light</option>
                    <option value='btn-dark'>Dark</option>
                    <option value='btn-link'>Link</option>
                </select>
            </div>

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.layoutGrid} /> Variant</div>
                <select name='btnVariant' value={vals.buttonVariant || ''} onChange={(e) => {
                    updateProperty('button-variant', e.target.value);
                    if (e.target.value !== '') {
                        updateProperty('border-radius', '');
                        updateProperty('border-color', '');
                        updateProperty('border-width', '');
                        updateProperty('border-style', '');
                    }
                }}>
                    <option value=''>Solid</option>
                    <option value='btn-pill'>Pill</option>
                    <option value='btn-square'>Square</option>
                    <option value='btn-bordered'>Bordered</option>
                    <option value='btn-dashed'>Dashed</option>
                </select>
            </div>

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.maximize} /> Size</div>
                <select name='btnSize' value={vals.buttonSize || ''} onChange={(e) => updateProperty('button-size', e.target.value)}>
                    <option value='btn-sm'>Small</option>
                    <option value=''>Default</option>
                    <option value='btn-lg'>Large</option>
                    <option value='btn-block'>Full Width</option>
                </select>
            </div>

            {(!vals.buttonStyle || vals.buttonStyle === '') && (
                <>
                    <div className='popup-divider' />
                    <div className='input-label' style={{ fontSize: '12px', opacity: 0.7 }}>Interaction States</div>

                    <div className='popup-input-item'>
                        <div className='input-label'><Icon icon={icons.mousePointer} /> Hover BG</div>
                        <div className='color-picker-wrapper '>
                            <input type='color' value={vals.hoverBgColor || '#000000'} onChange={(e) => updateProperty('hover-bg-color', e.target.value)} />
                            <p className='color-value-text'>{vals.hoverBgColor || 'Theme'}</p>
                            {vals.hoverBgColor && <button className='color-reset-btn' onClick={() => updateProperty('hover-bg-color', '')} title="Clear color"><Icon icon={icons.times} /></button>}
                        </div>
                    </div>

                    <div className='popup-input-item'>
                        <div className='input-label'><Icon icon={icons.type} /> Hover Text</div>
                        <div className='color-picker-wrapper'>
                            <input type='color' value={vals.hoverColor || '#ffffff'} onChange={(e) => updateProperty('hover-color', e.target.value)} />
                            <p className='color-value-text'>{vals.hoverColor || 'Theme'}</p>
                            {vals.hoverColor && <button className='color-reset-btn' onClick={() => updateProperty('hover-color', '')} title="Clear color"><Icon icon={icons.times} /></button>}
                        </div>
                    </div>

                    <div className='popup-input-item'>
                        <div className='input-label'><Icon icon={icons.mousePointer} /> Active BG</div>
                        <div className='color-picker-wrapper'>
                            <input type='color' value={vals.activeBgColor || '#000000'} onChange={(e) => updateProperty('active-bg-color', e.target.value)} />
                            <p className='color-value-text'>{vals.activeBgColor || 'Theme'}</p>
                            {vals.activeBgColor && <button className='color-reset-btn' onClick={() => updateProperty('active-bg-color', '')} title="Clear color"><Icon icon={icons.times} /></button>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ButtonControls;
