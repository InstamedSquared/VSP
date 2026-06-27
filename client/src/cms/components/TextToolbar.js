import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { useCMS } from '../../context/CMSContext';
import { usePopupMenu } from '../../context/PopupMenuContext';

const TagSelectorContent = ({ tags, currentTag, onSelect }) => {
    return (
        <div className='popup-tag-content'>
            {tags.map(t => (
                <div
                    key={t.value}
                    className={`popup-tag-item ${currentTag === t.label ? 'selected' : ''}`}
                    onClick={() => onSelect(t.value)}
                >
                    <p>{t.label}</p>
                    {currentTag === t.label && <Icon icon={icons.check} size={12} />}
                </div>
            ))}
        </div>
    );
};

const TextToolbar = ({ data, simple = false }) => {
    const { selectedElement, updateBlockProperty, view, activeStyleState } = useCMS();
    const { openPopupMenu, closePopupMenu } = usePopupMenu();

    // Use passed data or fall back to context
    const blockData = data || selectedElement?.data;
    const blockType = selectedElement?.type;

    // Content-editing commands (execCommand) modify HTML content — they are state-independent.
    // In hover/active/focus state, users should use the Typography panel in DesignControls instead.
    const isContentEditingDisabled = activeStyleState !== 'normal';

    const handleCommand = (e, command, value = null) => {
        e.preventDefault(); // Critical: prevents the button from taking focus away from the text
        if (isContentEditingDisabled) return;
        document.execCommand(command, false, value);
    };

    const handleColorChange = (e) => {
        if (isContentEditingDisabled) return;
        document.execCommand('foreColor', false, e.target.value);
    };

    if (!blockData || (blockType !== 'text' && blockType !== 'richtext' && !data)) return null;

    const getValue = (key) => {
        if (view === 'mobile') {
            const mobileProps = blockData?.responsive?.mobile?.properties || {};
            const tabletProps = blockData?.responsive?.tablet?.properties || {};
            return mobileProps[key] !== undefined ? mobileProps[key] : (tabletProps[key] !== undefined ? tabletProps[key] : (blockData?.properties?.[key] || ''));
        }
        if (view === 'tablet') {
            const tabletProps = blockData?.responsive?.tablet?.properties || {};
            return tabletProps[key] !== undefined ? tabletProps[key] : (blockData?.properties?.[key] || '');
        }
        return blockData?.properties?.[key] || '';
    };

    let currentTag = (blockData?.tag || '').toUpperCase();

    // Smart Tag Detection for legacy content (extract <h1>...</h1> etc.)
    if (!currentTag && blockData?.content) {
        const match = blockData.content.trim().match(/^<([a-z1-6]+)(?:\s+[^>]*)?>(.*)  <\/\1>$/is);
        if (match) {
            currentTag = match[1].toUpperCase();
        }
    }

    if (!currentTag) currentTag = 'P';

    const tags = [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'H5', value: 'h5' },
        { label: 'H6', value: 'h6' },
        { label: 'P', value: 'p' },
        { label: 'DIV', value: 'div' },
        { label: 'SMALL', value: 'small' },
        { label: 'LINK', value: 'a' },
    ];

    const handleTagChange = (tag) => {
        updateBlockProperty(selectedElement.sectionId, selectedElement.id, 'tag', tag);
        closePopupMenu();
    };

    const disabledBtnStyle = { opacity: 0.35, cursor: 'not-allowed' };
    const disabledTitle = (label) => `${label} unavailable in ${activeStyleState} state — use the Typography (T) panel`;

    return (
        <div className={`text-toolbar-inner ${simple ? 'simple' : ''}`} style={{ display: 'flex', alignItems: 'center' }}>
            {!simple && <div className="toolbar-divider" />}

            {currentTag !== 'A' && (
                <>
                    <div className="toolbar-group">
                        <button
                            className='toolbar-btn dropdown toolbar-tag-btn'
                            title="Text Style"
                            onClick={(e) => openPopupMenu({
                                referenceElement: e.currentTarget,
                                content: <TagSelectorContent tags={tags} currentTag={currentTag} onSelect={handleTagChange} />,
                                placement: 'bottom-start'
                            })}
                        >
                            <span>{currentTag}</span>
                            <Icon icon={icons.chevronDown} size={10} />
                        </button>
                    </div>
                    <div className="toolbar-divider" />
                </>
            )}

            <div className="toolbar-group">
                <div className="icon-btn-group">
                    <button
                        className={`toolbar-btn ${isContentEditingDisabled ? '' : (document.queryCommandState?.('bold') ? 'active' : '')}`}
                        title={isContentEditingDisabled ? disabledTitle('Bold') : 'Bold'}
                        onMouseDown={(e) => handleCommand(e, 'bold')}
                        style={isContentEditingDisabled ? disabledBtnStyle : {}}
                    >
                        <Icon icon={icons.bold} size={14} />
                    </button>
                    <button
                        className={`toolbar-btn ${isContentEditingDisabled ? '' : (document.queryCommandState?.('italic') ? 'active' : '')}`}
                        title={isContentEditingDisabled ? disabledTitle('Italic') : 'Italic'}
                        onMouseDown={(e) => handleCommand(e, 'italic')}
                        style={isContentEditingDisabled ? disabledBtnStyle : {}}
                    >
                        <Icon icon={icons.italic} size={14} />
                    </button>
                    <button
                        className={`toolbar-btn ${isContentEditingDisabled ? '' : (document.queryCommandState?.('underline') ? 'active' : '')}`}
                        title={isContentEditingDisabled ? disabledTitle('Underline') : 'Underline'}
                        onMouseDown={(e) => handleCommand(e, 'underline')}
                        style={isContentEditingDisabled ? disabledBtnStyle : {}}
                    >
                        <Icon icon={icons.underline} size={14} />
                    </button>
                </div>
            </div>

            <div className="toolbar-group">
                {currentTag !== 'A' && (
                    <button
                        className={`toolbar-btn ${document.queryCommandState?.('insertUnorderedList') ? 'active' : ''}`}
                        title="Bullet List"
                        onMouseDown={(e) => handleCommand(e, 'insertUnorderedList')}
                    >
                        <Icon icon={icons.list} size={14} />
                    </button>
                )}
                <button
                    className="toolbar-btn"
                    title="Clear Formatting"
                    onMouseDown={(e) => handleCommand(e, 'removeFormat')}
                >
                    <Icon icon={icons.eraser} size={14} />
                </button>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <button
                        className="toolbar-btn"
                        title={isContentEditingDisabled ? disabledTitle('Text Color') : 'Text Color'}
                        style={isContentEditingDisabled ? disabledBtnStyle : {}}
                        onClick={() => { if (!isContentEditingDisabled) document.getElementById('text-color-picker').click(); }}
                    >
                        <Icon icon={icons.droplet} size={14} />
                    </button>
                    <input
                        id="text-color-picker"
                        type="color"
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                        onChange={handleColorChange}
                    />
                    <button
                        className="toolbar-btn color-reset-btn"
                        title="Reset Text Color"
                        onClick={(e) => {
                            e.preventDefault();
                            document.execCommand('foreColor', false, 'inherit');
                        }}
                    >
                        <Icon icon={icons.times} size={14} />
                    </button>
                </div>
            </div>

            {!simple && (
                <>
                    <div className="toolbar-divider" />
                    <div className="toolbar-group">
                        <button className="toolbar-btn" title="Insert Link"><Icon icon={icons.link} size={14} /></button>
                        <button className="toolbar-btn" title="Insert Image"><Icon icon={icons.image} size={14} /></button>
                        <button className="toolbar-btn" title="Insert Code"><Icon icon={icons.code} size={14} /></button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TextToolbar;
