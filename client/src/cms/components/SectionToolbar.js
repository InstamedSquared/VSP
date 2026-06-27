import React from 'react';
import { useCMS } from '../../context/CMSContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import DesignControls from './DesignControls';
import CmsBreadcrumbs from './CmsBreadcrumbs';

const SectionToolbar = ({ data }) => {
    const { updateSectionSetting, selectedElement } = useCMS();

    if (!data) return null;

    const settings = data.settings || {};

    const handleChange = (key, value) => {
        updateSectionSetting(data.id, key, value);
    };

    return (
        <div className="section-toolbar">
            <CmsBreadcrumbs />
            {selectedElement && selectedElement.type !== 'section' && <div className='toolbar-divider' />}
            <DesignControls data={data} updateProperty={handleChange} type={data.id === 'header' || data.id === 'footer' ? data.id : 'section'} />

            <div className='toolbar-divider' />

            <div className='toolbar-group'>
                <input type='text' name='innerClass' placeholder='Inner Class' style={{ width: '100px' }} value={settings.innerClass || ''} autoComplete="off" onChange={(e) => handleChange('innerClass', e.target.value)} />
            </div>
        </div>
    );
};

export default SectionToolbar;
