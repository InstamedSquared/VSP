import React from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { useCMS } from '../../context/CMSContext';
import { usePopupMenu } from '../../context/PopupMenuContext';
import TextToolbar from './TextToolbar';
import DesignControls, { LinkControls } from './DesignControls';
import ButtonControls from './ButtonControls';
import VideoControls from './VideoControls';
import CmsBreadcrumbs from './CmsBreadcrumbs';
import IconPicker from './IconPicker';
import IconControls from './IconControls';

const BlockToolbar = ({ data, type }) => {
    const { selectedElement, updateBlockProperty, updateNavigationProperty, view } = useCMS();
    const { openPopupMenu, closePopupMenu } = usePopupMenu();

    const handlePropertyChange = (key, value) => {
        if (selectedElement.type === 'nav-link') {
            updateNavigationProperty(selectedElement.id, key, value);
        } else {
            updateBlockProperty(selectedElement.sectionId, selectedElement.id, key, value);
        }
    };

    const getValue = (key) => {
        if (view === 'mobile') {
            const mobileProps = data?.responsive?.mobile?.properties || {};
            const tabletProps = data?.responsive?.tablet?.properties || {};
            return mobileProps[key] !== undefined ? mobileProps[key] : (tabletProps[key] !== undefined ? tabletProps[key] : (data?.properties?.[key] || ''));
        }
        if (view === 'tablet') {
            const tabletProps = data?.responsive?.tablet?.properties || {};
            return tabletProps[key] !== undefined ? tabletProps[key] : (data?.properties?.[key] || '');
        }
        return data?.properties?.[key] || '';
    };

    // Button Settings Change Detection
    const hasButtonChanges = () => {
        const iconGap = getValue('iconGap');
        const buttonStyle = getValue('button-style');
        const buttonVariant = getValue('button-variant');
        const buttonSize = getValue('button-size');
        const hoverBgColor = getValue('hover-bg-color');
        const hoverColor = getValue('hover-color');
        const activeBgColor = getValue('active-bg-color');

        return !!(
            (iconGap && iconGap !== '0px') ||
            buttonStyle ||
            buttonVariant ||
            buttonSize ||
            hoverBgColor ||
            hoverColor ||
            activeBgColor
        );
    };

    // Icon Settings Change Detection
    const hasIconChanges = () => {
        const size = getValue('size');
        const color = getValue('color');
        const hoverColor = getValue('hover-color');
        const hoverBgColor = getValue('hover-bg-color');
        const activeBgColor = getValue('active-bg-color');
        const hoverScale = getValue('hover-scale');

        return !!(
            (size && parseInt(size) !== 24) ||
            (color && color !== '#333333' && color !== '#333') ||
            hoverColor ||
            hoverBgColor ||
            activeBgColor ||
            hoverScale
        );
    };

    // Video Settings Change Detection (checking deviations from default template values)
    const hasVideoChanges = () => {
        const src = getValue('src');
        const poster = getValue('poster');
        const controls = getValue('controls');
        const autoplay = getValue('autoplay');
        const loop = getValue('loop');
        const muted = getValue('muted');

        return !!(
            src ||
            poster ||
            controls === false ||
            autoplay ||
            loop
        );
    };

    return (
        <div className='block-toolbar'>
            <CmsBreadcrumbs />
            <div className='toolbar-divider' />

            {/* Universal Design Controls */}
            <DesignControls type='block' data={data} updateProperty={handlePropertyChange} />



            {(type === 'button' || type === 'image' || type === 'icon' || type === 'video' || type === 'nav-link') && (
                <>
                    <div className='toolbar-divider' />
                    <div className='toolbar-group'>
                        {(type === 'button' || type === 'nav-link') && (
                            <>

                                <div className='icon-btn-group'>
                                    <button
                                        className={`toolbar-btn ${getValue('iconLeft') ? 'active' : ''}`}
                                        title='Left Icon'
                                        onClick={(e) => openPopupMenu({
                                            referenceElement: e.currentTarget,
                                            content: <IconPicker
                                                currentIcon={getValue('iconLeft')}
                                                onSelect={(icon) => { handlePropertyChange('iconLeft', icon); closePopupMenu(); }}
                                            />,
                                            placement: 'bottom-start'
                                        })}
                                    >
                                        <Icon icon={icons[getValue('iconLeft')] || icons.add} size={14} />
                                        {getValue('iconLeft') && <span className='toolbar-btn-indicator' />}
                                    </button>
                                    <button
                                        className={`toolbar-btn ${getValue('iconRight') ? 'active' : ''}`}
                                        title='Right Icon'
                                        onClick={(e) => openPopupMenu({
                                            referenceElement: e.currentTarget,
                                            content: <IconPicker
                                                currentIcon={getValue('iconRight')}
                                                onSelect={(icon) => { handlePropertyChange('iconRight', icon); closePopupMenu(); }}
                                            />,
                                            placement: 'bottom-start'
                                        })}
                                    >
                                        <Icon icon={icons[getValue('iconRight')] || icons.add} size={14} />
                                        {getValue('iconRight') && <span className='toolbar-btn-indicator' />}
                                    </button>
                                    <button
                                        className={`toolbar-btn`}
                                        title='Button Settings'
                                        onClick={(e) => openPopupMenu({
                                            referenceElement: e.currentTarget,
                                            content: <ButtonControls updateProperty={handlePropertyChange} />,
                                            placement: 'bottom-start'
                                        })}
                                    >
                                        <Icon icon={icons.settings} size={14} />
                                        {hasButtonChanges() && <span className='toolbar-btn-indicator' />}
                                    </button>
                                </div>
                            </>
                        )}

                        {type === 'icon' && (
                            <div className='icon-btn-group'>
                                <button
                                    className={`toolbar-btn ${getValue('icon') ? 'active' : ''}`}
                                    title='Select Icon'
                                    onClick={(e) => openPopupMenu({
                                        referenceElement: e.currentTarget,
                                        content: <IconPicker
                                            currentIcon={getValue('icon') || 'info'}
                                            onSelect={(icon) => { handlePropertyChange('icon', icon); closePopupMenu(); }}
                                        />,
                                        placement: 'bottom-start'
                                    })}
                                >
                                    <Icon icon={icons[getValue('icon')] || icons.info} size={14} />
                                </button>
                                <button
                                    className={`toolbar-btn`}
                                    title='Icon Settings'
                                    onClick={(e) => openPopupMenu({
                                        referenceElement: e.currentTarget,
                                        content: <IconControls updateProperty={handlePropertyChange} />,
                                        placement: 'bottom-start'
                                    })}
                                >
                                    <Icon icon={icons.settings} size={14} />
                                    {hasIconChanges() && <span className='toolbar-btn-indicator' />}
                                </button>
                            </div>
                        )}

                        {type === 'image' && (
                            <div className='toolbar-item'>
                                <input style={{ width: '100px' }} name='cmsImage_src' type='text' placeholder='Image Src' value={getValue('src')} onChange={(e) => handlePropertyChange('src', e.target.value)} />
                            </div>
                        )}

                        {type === 'video' && (
                            <div className='toolbar-group'>
                                <button
                                    className={`toolbar-btn`}
                                    title='Video Settings'
                                    onClick={(e) => openPopupMenu({
                                        referenceElement: e.currentTarget,
                                        content: <VideoControls updateProperty={handlePropertyChange} />,
                                        placement: 'bottom-start'
                                    })}
                                >
                                    <Icon icon={icons.video} size={14} />
                                    <Icon icon={icons.chevronDown} size={10} style={{ marginLeft: '2px', opacity: 0.5 }} />
                                    {hasVideoChanges() && <span className='toolbar-btn-indicator' />}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}


            {(data.tag === 'a' || type === 'button' || type === 'icon' || type === 'nav-link') && (
                <>
                    <div className='toolbar-divider' />
                    <div className='toolbar-group'>
                        <button
                            className={`toolbar-btn ${getValue('href') && getValue('href') !== '#' ? 'active' : ''}`}
                            title='Link Settings'
                            onClick={(e) => openPopupMenu({
                                referenceElement: e.currentTarget,
                                content: <LinkControls updateProperty={handlePropertyChange} />,
                                placement: 'bottom-start'
                            })}
                        >
                            <Icon icon={icons.link} size={14} />
                            {getValue('href') && getValue('href') !== '#' && <span className='toolbar-btn-indicator' />}
                        </button>
                    </div>
                </>
            )}

            {/* Redirect text blocks to their specific toolbar for content editing if needed */}
            {(type === 'text' || type === 'richtext') && (<> <div className='toolbar-divider' /> <TextToolbar data={data} simple={true} /> </>)}

        </div>
    );
};

export default BlockToolbar;
