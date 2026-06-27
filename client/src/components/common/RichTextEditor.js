import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent, NodeViewWrapper } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { Highlight } from '@tiptap/extension-highlight';
import { Node, mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react';

import Icon from './Icon';
import { icons } from '../../config/icons';

const CustomBold = Bold.extend({
    renderHTML({ HTMLAttributes }) { return ['b', HTMLAttributes, 0]; },
    parseHTML() { return [{ tag: 'b' }, { tag: 'strong' }, { style: 'font-weight', getAttrs: value => /^(bold(er)?|[5-9]00)$/.test(value) && null }]; },
});

const CustomItalic = Italic.extend({
    renderHTML({ HTMLAttributes }) { return ['i', HTMLAttributes, 0]; },
    parseHTML() { return [{ tag: 'i' }, { tag: 'em' }, { fontStyle: 'italic' }]; },
});

const MediaNodeView = (props) => {
    const { node, updateAttributes, selected, deleteNode } = props;
    const { src, width, height } = node.attrs;
    const isVideo = node.type.name === 'resizableVideo';
    const containerRef = useRef(null);

    const startResize = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = containerRef.current.offsetWidth;
        const startHeight = containerRef.current.offsetHeight;

        const onMouseMove = (moveEvent) => {
            if (direction === 'width' || direction === 'both') {
                const currentWidth = startWidth + (moveEvent.clientX - startX);
                containerRef.current.style.width = `${Math.max(50, currentWidth)}px`;
            }
            if (direction === 'height' || direction === 'both') {
                const currentHeight = startHeight + (moveEvent.clientY - startY);
                containerRef.current.style.height = `${Math.max(50, currentHeight)}px`;
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            updateAttributes({
                width: containerRef.current.style.width,
                height: containerRef.current.style.height || 'auto'
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <NodeViewWrapper className={`resizable-media-wrapper ${isVideo ? 'is-video' : 'is-image'} ${selected ? 'is-selected' : ''}`}>
            <div
                className="media-container"
                ref={containerRef}
                style={{
                    width: width || '100%',
                    height: height || 'auto',
                    display: 'inline-block',
                    lineHeight: 0
                }}
            >
                {isVideo ? (
                    <video
                        src={src}
                        controls
                        muted
                        preload="auto"
                        playsInline
                        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'fill' }}
                    />
                ) : (
                    <img src={src} alt="" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'fill' }} />
                )}

                {selected && (
                    <>
                        <div className="resizer resizer-right" onMouseDown={(e) => startResize(e, 'width')} />
                        <div className="resizer resizer-bottom" onMouseDown={(e) => startResize(e, 'height')} />
                        <div className="resizer resizer-both" onMouseDown={(e) => startResize(e, 'both')} />

                        <button type="button" className="media-delete-btn" onClick={deleteNode} title="Delete Media">
                            <Icon icon={icons.delete} />
                        </button>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
};

const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            src: {
                default: null,
                parseHTML: element => element.getAttribute('src'),
                renderHTML: attributes => ({ src: attributes.src })
            },
            width: {
                default: '100%',
                parseHTML: element => element.getAttribute('width'),
                renderHTML: attributes => ({ width: attributes.width })
            },
            height: {
                default: 'auto',
                parseHTML: element => element.getAttribute('height'),
                renderHTML: attributes => ({ height: attributes.height })
            },
        }
    },
    addNodeView() {
        return ReactNodeViewRenderer(MediaNodeView);
    },
});

const ResizableVideo = Node.create({
    name: 'resizableVideo',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: element => element.getAttribute('src'),
                renderHTML: attributes => ({ src: attributes.src })
            },
            width: {
                default: '100%',
                parseHTML: element => element.getAttribute('width'),
                renderHTML: attributes => ({ width: attributes.width })
            },
            height: {
                default: 'auto',
                parseHTML: element => element.getAttribute('height'),
                renderHTML: attributes => ({ height: attributes.height })
            },
        }
    },
    parseHTML() { return [{ tag: 'video' }] },
    renderHTML({ HTMLAttributes }) { return ['video', mergeAttributes(HTMLAttributes, { controls: true })] },
    addNodeView() { return ReactNodeViewRenderer(MediaNodeView) },
});

// --- Internal Helpers ---

const beautifyHTML = (html) => {
    if (!html) return '';
    let result = '';
    let level = 0;
    // Split by tags but keep the tags
    const tokens = html.split(/(<[^>]+>)/g).filter(t => t !== '');

    tokens.forEach(token => {
        if (token.startsWith('</')) {
            level--;
            result += '\n' + '    '.repeat(Math.max(0, level)) + token;
        } else if (token.startsWith('<') && !token.endsWith('/>')) {
            const tagName = token.match(/<([^\s>]+)/)?.[1];
            const isSelfClosing = ['img', 'video', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName?.toLowerCase());

            result += '\n' + '    '.repeat(Math.max(0, level)) + token;
            if (!isSelfClosing) {
                level++;
            }
        } else {
            // Text nodes - avoid excessive newlines but keep indentation for block context
            result += token.trim() ? (token.includes('\n') ? token : token) : '';
        }
    });
    return result.trim();
};

const Dropdown = ({ label, icon, children, isOpen, setIsOpen, className = "", disabled }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    return (
        <div className={`rte-dropdown ${className} ${isOpen ? 'is-open' : ''}`} ref={dropdownRef}>
            <button type="button" onClick={() => !disabled && setIsOpen(!isOpen)} className="rte-dropdown-trigger" disabled={disabled}>
                {icon ? <Icon icon={icon} /> : <span>{label}</span>}
                <Icon icon={icons.chevronDown} className="rte-dropdown-arrow" />
            </button>
            {isOpen && <div className="rte-dropdown-content">{children}</div>}
        </div>
    );
};

const LinkDialog = ({ editor, isOpen, onClose }) => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [target, setTarget] = useState('_self');
    const dialogRef = useRef(null);

    useEffect(() => {
        if (isOpen && editor) {
            const attrs = editor.getAttributes('link');
            setUrl(attrs.href || '');
            setTitle(attrs.title || '');
            setTarget(attrs.target || '_self');
        }
    }, [isOpen, editor]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleInsert = () => {
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url, title, target }).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        onClose();
    };

    return (
        <div className="rte-link-dialog" ref={dialogRef}>
            <div className="rte-dialog-header">
                <h3>Insert link</h3>
                <button type="button" onClick={onClose}><Icon icon={icons.close} /></button>
            </div>
            <div className="rte-dialog-body">
                <div className="rte-field">
                    <label>Link to</label>
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="http://" />
                </div>
                <div className="rte-field">
                    <label>Open this link in</label>
                    <select value={target} onChange={e => setTarget(e.target.value)}>
                        <option value="_self">The same window</option>
                        <option value="_blank">New window</option>
                    </select>
                </div>
                <div className="rte-field">
                    <label>Link title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                    <small>Used for accessibility and SEO</small>
                </div>
            </div>
            <div className="rte-dialog-footer">
                <button type="button" className="button btn-outlined" onClick={onClose}>Cancel</button>
                <button type="button" className="button btn-primary" onClick={handleInsert}>Insert link</button>
            </div>
        </div>
    );
};

const MenuBar = ({ editor, isCodeView, onToggleCode }) => {
    const [isHeadingOpen, setIsHeadingOpen] = useState(false);
    const [isAlignOpen, setIsAlignOpen] = useState(false);
    const [isLinkOpen, setIsLinkOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'image') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                const tempImg = new window.Image();
                tempImg.onload = () => {
                    let w = tempImg.width;
                    let h = tempImg.height;
                    if (h > 200) {
                        const ratio = 200 / h;
                        h = 200;
                        w = Math.round(w * ratio);
                    }
                    editor.chain().focus().setImage({ src: base64, width: `${w}px`, height: `${h}px` }).run();
                };
                tempImg.src = base64;
            };
            reader.readAsDataURL(file);
        } else if (type === 'video') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                const blobUrl = URL.createObjectURL(file);
                const tempVideo = document.createElement('video');

                const insertVideo = (w, h) => {
                    editor.chain().focus().insertContent({
                        type: 'resizableVideo',
                        attrs: { src: base64, width: w ? `${w}px` : '100%', height: h ? `${h}px` : 'auto' }
                    }).run();
                    URL.revokeObjectURL(blobUrl);
                };

                tempVideo.onloadedmetadata = () => {
                    let w = tempVideo.videoWidth;
                    let h = tempVideo.videoHeight;
                    if (h > 200) {
                        const ratio = 200 / h;
                        h = 200;
                        w = Math.round(w * ratio);
                    }
                    insertVideo(w, h);
                };

                tempVideo.onerror = () => insertVideo();
                setTimeout(() => { if (!tempVideo.videoWidth) insertVideo(); }, 2000);

                tempVideo.src = blobUrl;
                tempVideo.load();
            };
            reader.readAsDataURL(file);
        }
    };

    const isDisabled = isCodeView;

    return (
        <div className="rich-text-toolbar">
            <Dropdown
                label={
                    editor.isActive('heading', { level: 1 }) ? 'H1' :
                    editor.isActive('heading', { level: 2 }) ? 'H2' :
                    editor.isActive('heading', { level: 3 }) ? 'H3' :
                    editor.isActive('heading', { level: 4 }) ? 'H4' :
                    editor.isActive('heading', { level: 5 }) ? 'H5' : 'P'
                }
                isOpen={isHeadingOpen}
                setIsOpen={setIsHeadingOpen}
                className="rte-heading-dropdown"
                disabled={isDisabled}
            >
                <button type="button" onClick={() => { editor.chain().focus().setParagraph().run(); setIsHeadingOpen(false); }} className={editor.isActive('paragraph') ? 'is-active' : ''}>Paragraph</button>
                <button type="button" onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setIsHeadingOpen(false); }} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>Heading 1</button>
                <button type="button" onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setIsHeadingOpen(false); }} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>Heading 2</button>
                <button type="button" onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); setIsHeadingOpen(false); }} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>Heading 3</button>
                <button type="button" onClick={() => { editor.chain().focus().toggleHeading({ level: 4 }).run(); setIsHeadingOpen(false); }} className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}>Heading 4</button>
                <button type="button" onClick={() => { editor.chain().focus().toggleHeading({ level: 5 }).run(); setIsHeadingOpen(false); }} className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}>Heading 5</button>
            </Dropdown>

            <div className="toolbar-divider"></div>

            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} disabled={isDisabled} title="Bold"><Icon icon={icons.bold} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`rte-modern-hide ${editor.isActive('italic') ? 'is-active' : ''}`} disabled={isDisabled} title="Italic"><Icon icon={icons.italic} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`rte-modern-hide ${editor.isActive('underline') ? 'is-active' : ''}`} disabled={isDisabled} title="Underline"><Icon icon={icons.underline} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`rte-modern-hide ${editor.isActive('bulletList') ? 'is-active' : ''}`} disabled={isDisabled} title="Bullet List"><Icon icon={icons.listUl} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} disabled={isDisabled} title="Ordered List"><Icon icon={icons.listOl} /></button>

            <div className={`rte-color-picker ${isDisabled ? 'is-disabled' : ''}`}>
                <button type="button" title="Text Color" disabled={isDisabled}><Icon icon={icons.font} /></button>
                <input type="color" onInput={e => editor.chain().focus().setColor(e.target.value).run()} value={editor.getAttributes('textStyle').color || '#000000'} disabled={isDisabled} />
            </div>

            <div className={`rte-color-picker ${isDisabled ? 'is-disabled' : ''}`}>
                <button type="button" title="Highlight Color" disabled={isDisabled}><Icon icon={icons.highlighter} /></button>
                <input type="color" onInput={e => editor.chain().focus().setHighlight({ color: e.target.value }).run()} value={editor.getAttributes('highlight').color || '#ffff00'} disabled={isDisabled} />
            </div>

            <div className="toolbar-divider"></div>

            <Dropdown
                icon={editor.isActive({ textAlign: 'center' }) ? icons.alignCenter : editor.isActive({ textAlign: 'right' }) ? icons.alignRight : editor.isActive({ textAlign: 'justify' }) ? icons.alignJustify : icons.alignLeft}
                isOpen={isAlignOpen}
                setIsOpen={setIsAlignOpen}
                className="rte-align-dropdown"
                disabled={isDisabled}
            >
                <button type="button" onClick={() => { editor.chain().focus().setTextAlign('left').run(); setIsAlignOpen(false); }} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}><Icon icon={icons.alignLeft} /> Left</button>
                <button type="button" onClick={() => { editor.chain().focus().setTextAlign('center').run(); setIsAlignOpen(false); }} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}><Icon icon={icons.alignCenter} /> Center</button>
                <button type="button" onClick={() => { editor.chain().focus().setTextAlign('right').run(); setIsAlignOpen(false); }} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}><Icon icon={icons.alignRight} /> Right</button>
                <button type="button" onClick={() => { editor.chain().focus().setTextAlign('justify').run(); setIsAlignOpen(false); }} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}><Icon icon={icons.alignJustify} /> Justify</button>
            </Dropdown>

            <div className="toolbar-divider"></div>

            <div className="rte-link-wrap" style={{ position: 'relative' }}>
                <button type="button" onClick={() => setIsLinkOpen(true)} className={editor.isActive('link') ? 'is-active' : ''} disabled={isDisabled} title="Insert Link"><Icon icon={icons.link} /></button>
                <LinkDialog editor={editor} isOpen={isLinkOpen} onClose={() => setIsLinkOpen(false)} />
            </div>

            <button type="button" onClick={() => fileInputRef.current?.click()} className="rte-modern-hide" disabled={isDisabled} title="Insert Image"><Icon icon={icons.fileImage} /></button>
            <input type="file" ref={fileInputRef} onChange={e => handleFileUpload(e, 'image')} accept="image/*" style={{ display: 'none' }} />

            <button type="button" onClick={() => videoInputRef.current?.click()} className="rte-modern-hide" disabled={isDisabled} title="Insert Video"><Icon icon={icons.video} /></button>
            <input type="file" ref={videoInputRef} onChange={e => handleFileUpload(e, 'video')} accept="video/*" style={{ display: 'none' }} />

            <div className="toolbar-divider"></div>

            <button type="button" onClick={onToggleCode} className={isCodeView ? 'is-active' : ''} title="HTML Source Code">
                <Icon icon={icons.code} />
            </button>

            <div className="toolbar-divider"></div>

            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo() || isDisabled} title="Undo"><Icon icon={icons.undo} /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo() || isDisabled} title="Redo"><Icon icon={icons.redo} /></button>

            <Dropdown
                icon={icons.menu}
                isOpen={isMoreOpen}
                setIsOpen={setIsMoreOpen}
                className="rte-more-menu"
                disabled={isDisabled}
            >
                <button type="button" onClick={() => { editor.chain().focus().toggleItalic().run(); setIsMoreOpen(false); }} className={editor.isActive('italic') ? 'is-active' : ''}><Icon icon={icons.italic} /> Italic</button>
                <button type="button" onClick={() => { editor.chain().focus().toggleUnderline().run(); setIsMoreOpen(false); }} className={editor.isActive('underline') ? 'is-active' : ''}><Icon icon={icons.underline} /> Underline</button>
                <button type="button" onClick={() => { editor.chain().focus().toggleBulletList().run(); setIsMoreOpen(false); }} className={editor.isActive('bulletList') ? 'is-active' : ''}><Icon icon={icons.listUl} /> Bullet List</button>
                <button type="button" onClick={() => { fileInputRef.current?.click(); setIsMoreOpen(false); }}><Icon icon={icons.fileImage} /> Photo</button>
                <button type="button" onClick={() => { videoInputRef.current?.click(); setIsMoreOpen(false); }}><Icon icon={icons.video} /> Video</button>
            </Dropdown>
        </div>
    );
};

const RichTextEditor = ({ value, onChange, placeholder = 'Write something...' }) => {
    const [isCodeView, setIsCodeView] = useState(false);
    const [codeContent, setCodeContent] = useState('');

    const extensions = React.useMemo(() => [
        StarterKit.configure({ bold: false, italic: false, link: false, underline: false }),
        CustomBold,
        CustomItalic,
        Underline,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TextStyle,
        Color,
        Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: null } }),
        ResizableImage.configure({ inline: false }),
        ResizableVideo.configure({ inline: false }),
        Youtube.configure({ width: 480, height: 270 }),
        Highlight.configure({ multicolor: true }),
        Placeholder.configure({ placeholder }),
    ], [placeholder]);

    const editor = useEditor({
        extensions,
        content: value,
        onUpdate: ({ editor }) => {
            if (!isCodeView) {
                const html = editor.getHTML();
                onChange(html);
            }
        },
        onBlur: ({ editor }) => {
            const { selection } = editor.state;
            if (selection.node && (selection.node.type.name === 'image' || selection.node.type.name === 'resizableVideo')) {
                try {
                    editor.commands.deselectNode();
                } catch (e) { }
            }
        }
    });

    useEffect(() => {
        if (!editor || value === undefined || value === null) return;

        // Prevent updates if we are in code view or if the content matches
        if (isCodeView) return;

        const currentHTML = editor.getHTML();
        if (value !== currentHTML) {
            // If the value is a beautified string from our own toggle, 
            // Tiptap might normalize it differently, which causes a loop.
            // We only update if the normalized versions differ.
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = value;
            const normalizedValue = tempDiv.innerHTML;

            tempDiv.innerHTML = currentHTML;
            const normalizedCurrent = tempDiv.innerHTML;

            if (normalizedValue !== normalizedCurrent) {
                editor.commands.setContent(value, false);
            }
        }
    }, [value, editor, isCodeView]);

    const handleToggleCode = () => {
        if (!isCodeView) {
            const raw = editor.getHTML();
            setCodeContent(beautifyHTML(raw));
        } else {
            // When toggling back, we update the editor first
            editor.commands.setContent(codeContent, true);
            // Then notify parent of the latest clean HTML from the editor
            onChange(editor.getHTML());
        }
        setIsCodeView(!isCodeView);
    };

    return (
        <div className="rich-text-editor-container">
            <MenuBar editor={editor} isCodeView={isCodeView} onToggleCode={handleToggleCode} />
            <div className="rich-text-content">
                <textarea
                    className="rich-text-code-view"
                    name="richtext_codeview"
                    style={{ display: isCodeView ? 'block' : 'none' }}
                    value={codeContent}
                    onChange={(e) => {
                        setCodeContent(e.target.value);
                        onChange(e.target.value);
                    }}
                />
                <div style={{ display: !isCodeView ? 'flex' : 'none', flex: 1, flexDirection: 'column' }}>
                    <EditorContent editor={editor} className="tiptap-editor" />
                </div>
            </div>
        </div>
    );
};

export default RichTextEditor;
