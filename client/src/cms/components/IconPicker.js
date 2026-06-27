import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { icons, iconCategories } from '../../config/icons';

const IconPicker = ({ onSelect, currentIcon }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const allIcons = Object.keys(icons).sort();

    const filteredIcons = allIcons.filter(key => {
        const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        if (activeCategory === 'All') return true;

        // Check if icon is in active category
        const categoryIcons = iconCategories[activeCategory];
        return categoryIcons && Object.keys(categoryIcons).includes(key);
    });

    const categories = ['All', ...Object.keys(iconCategories)];

    return (
        <div className='cms-toolbar-popup-icon'>
            <header>
                <div className='input-group'>
                    <input name='tt_iconSearch_ipt' type='text' placeholder='Search icons...' value={searchTerm} autoComplete="off" onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
                </div>
                <select name='tt_iconType' value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
            </header>
            <div className='popup-divider'></div>
            <div className='cms-toolbar-popup-icon-grid scrollbar-admin'>
                <span onClick={() => onSelect('')} title='None'> <Icon icon={icons.times} opacity={0.3} /> </span>
                {filteredIcons.map(key => (
                    <span
                        key={key}
                        className={`${currentIcon === key ? 'active' : ''}`}
                        onClick={() => onSelect(key)}
                        title={key}
                    >
                        <Icon icon={icons[key]} />
                    </span>
                ))}
                {filteredIcons.length === 0 && (
                    <div className='icon-picker-empty'> No icons found for "{searchTerm}" </div>
                )}
            </div>
        </div>
    );
};

export default IconPicker;
