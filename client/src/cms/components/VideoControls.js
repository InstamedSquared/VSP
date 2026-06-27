import React from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { useCMS } from '../../context/CMSContext';

const VideoControls = ({ updateProperty }) => {
    const { view, selectedElement } = useCMS();
    const data = selectedElement?.data;

    if (!data) return null;

    const getValues = () => {
        const props = data.properties || {};
        const mobile = data.responsive?.mobile?.properties || {};
        const tablet = data.responsive?.tablet?.properties || {};
        const resolve = (key) => {
            if (view === 'mobile') return mobile[key] ?? tablet[key] ?? props[key];
            if (view === 'tablet') return tablet[key] ?? props[key];
            return props[key];
        };
        return {
            src: resolve('src'),
            poster: resolve('poster'),
            controls: resolve('controls'),
            autoplay: resolve('autoplay'),
            loop: resolve('loop'),
            muted: resolve('muted'),
            objectFit: resolve('object-fit'),
        };
    };

    const vals = getValues();

    return (
        <div className='background-popup-content' style={{ width: '280px' }}>
            <div className='popup-input-item' style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                <div className='input-label'><Icon icon={icons.video} /> Video URL</div>
                <input type='text' name='cmsVideo_src' placeholder='https://...' style={{ width: '100%' }} value={vals.src || ''} autoComplete="off" onChange={(e) => updateProperty('src', e.target.value)} />
            </div>

            <div className='popup-input-item' style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                <div className='input-label'><Icon icon={icons.image} /> Poster Image URL</div>
                <input type='text' name='cmsVideo_poster' placeholder='https://...' style={{ width: '100%' }} value={vals.poster || ''} autoComplete="off" onChange={(e) => updateProperty('poster', e.target.value)} />
            </div>

            <div className='popup-divider' />

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.eye} /> Show Controls</div>
                <div className='toggle-switch radius'>
                    <label>
                        <input type='checkbox' checked={vals.controls !== false} onChange={(e) => updateProperty('controls', e.target.checked ? true : false)} />
                        <span></span>
                    </label>
                </div>
            </div>

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.refresh} /> Autoplay</div>
                <div className='toggle-switch radius'>
                    <label>
                        <input type='checkbox' checked={!!vals.autoplay} onChange={(e) => updateProperty('autoplay', e.target.checked ? true : false)} />
                        <span></span>
                    </label>
                </div>
            </div>

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.repeat} /> Loop</div>
                <div className='toggle-switch radius'>
                    <label>
                        <input type='checkbox' checked={!!vals.loop} onChange={(e) => updateProperty('loop', e.target.checked ? true : false)} />
                        <span></span>
                    </label>
                </div>
            </div>

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={vals.muted ? icons.eyeOff : icons.eye} /> Muted</div>
                <div className='toggle-switch radius'>
                    <label>
                        <input type='checkbox' checked={!!vals.muted} onChange={(e) => updateProperty('muted', e.target.checked ? true : false)} />
                        <span></span>
                    </label>
                </div>
            </div>

            <div className='popup-divider' />

            <div className='popup-input-item space-between'>
                <div className='input-label'><Icon icon={icons.maximize} /> Object Fit</div>
                <select value={vals.objectFit || ''} onChange={(e) => updateProperty('object-fit', e.target.value)}>
                    <option value=''>Default (Contain)</option>
                    <option value='cover'>Cover</option>
                    <option value='contain'>Contain</option>
                    <option value='fill'>Fill</option>
                    <option value='none'>None</option>
                    <option value='scale-down'>Scale Down</option>
                </select>
            </div>
        </div>
    );
};

export default VideoControls;