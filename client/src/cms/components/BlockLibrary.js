import React from 'react';
import { useCMS } from '../../context/CMSContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';

const BlockLibrary = () => {
    const { addBlock, addSection } = useCMS();

    const blockCategories = [
        {
            name: 'Structures',
            items: [
                {
                    name: 'Empty Section',
                    icon: icons.layout,
                    isSection: true,
                    template: { key: 'empty' }
                },
            ]
        },
        {
            name: 'Typography',
            items: [
                { name: 'H1 Heading', icon: icons.header, template: { block_type: 'text', tag: 'h1', content: 'Main Heading' } },
                { name: 'H2 Heading', icon: icons.header, template: { block_type: 'text', tag: 'h2', content: 'Sub Heading' } },
                { name: 'H3 Heading', icon: icons.header, template: { block_type: 'text', tag: 'h3', content: 'Section Title' } },
                { name: 'H4 Heading', icon: icons.header, template: { block_type: 'text', tag: 'h4', content: 'Small Heading' } },
                { name: 'H5 Heading', icon: icons.header, template: { block_type: 'text', tag: 'h5', content: 'Minor Heading' } },
                { name: 'Paragraph', icon: icons.paragraph, template: { block_type: 'text', tag: 'p', content: 'Start typing your content here...' } },
                { name: 'Small Text', icon: icons.font, template: { block_type: 'text', tag: 'small', content: 'Small descriptive text' } },
                { name: 'Text Link', icon: icons.link, template: { block_type: 'text', tag: 'a', content: 'Link Text', properties: { href: '#', target: '_self' } } },
            ]
        },
        {
            name: 'Media & Action',
            items: [
                { name: 'Image', icon: icons.image, template: { block_type: 'image', properties: { src: '/defaults/no-image.webp' } } },
                { name: 'Video', icon: icons.video, template: { block_type: 'video', properties: { src: '', controls: true, muted: true } } },
                { name: 'Button', icon: icons.mousePointer, template: { block_type: 'button', content: 'Click Me', properties: {} } },
                { name: 'Icon', icon: icons.info, template: { block_type: 'icon', properties: { icon: 'info', size: 24, color: '#333' } } },
            ]
        },
        {
            name: 'Layout',
            items: [
                {
                    name: '2 Columns',
                    icon: icons.columns,
                    template: {
                        block_type: 'container',
                        properties: { className: 'cms-cols-row' },
                        blocks: [
                            { block_type: 'container', properties: { className: 'cms-col' }, blocks: [] },
                            { block_type: 'container', properties: { className: 'cms-col' }, blocks: [] }
                        ]
                    }
                },
                {
                    name: '3 Columns',
                    icon: icons.columns,
                    template: {
                        block_type: 'container',
                        properties: { className: 'cms-cols-row' },
                        blocks: [
                            { block_type: 'container', properties: { className: 'cms-col' }, blocks: [] },
                            { block_type: 'container', properties: { className: 'cms-col' }, blocks: [] },
                            { block_type: 'container', properties: { className: 'cms-col' }, blocks: [] }
                        ]
                    }
                },
                { name: 'Empty Container', icon: icons.layout, template: { block_type: 'container', properties: { className: 'flex-block', padding: '20px' }, blocks: [] } },
            ]
        },
        {
            name: 'Components',
            items: [
                {
                    name: 'Basic Card',
                    icon: icons.app,
                    template: {
                        block_type: 'container',
                        properties: {
                            className: 'card-case',
                            padding: '20px',
                            'bg-color': '#ffffff',
                            'flex-direction': 'column',
                            gap: '10px',
                            'border-radius': '12px',
                            'box-shadow': '0px 0px 15px 0px #d8d0d0',
                        },
                        blocks: [
                            { block_type: 'image', properties: { src: '/defaults/no-image.webp', height: '150px' } },
                            { block_type: 'text', tag: 'h3', content: 'Card Title', properties: { 'margin-bottom': '10px' } },
                            { block_type: 'text', tag: 'p', content: 'Card description goes here.', properties: { 'margin-bottom': '15px' } },
                            { block_type: 'button', content: 'Learn More', properties: { 'button-style': 'btn-primary' } }
                        ]
                    }
                },
            ]
        }
    ];

    return (
        <div className='cms-props-list-case'>
            {blockCategories.map((category, catIdx) => (
                <React.Fragment key={catIdx}>
                    <div className='cms-props-list-head'><h4>{category.name}</h4></div>
                    <div className='cms-props-grid-body'>
                        {category.items.map((item, itemIdx) => (
                            <div
                                key={itemIdx}
                                className='cms-props-grid-item' title={`Add ${item.name}`}
                                onClick={() => {
                                    if (item.isSection) { addSection(item.template.key, item.name); }
                                    else { addBlock(item.template); }
                                }} >
                                <div className='item-preview'> <Icon icon={item.icon} size={24} /> </div>
                                <div className='item-info'> <b>{item.name}</b> </div>
                            </div>
                        ))}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default BlockLibrary;
