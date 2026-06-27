import React from 'react';
import { useCMS } from '../../context/CMSContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';

const TemplateGallery = () => {
    const { templates, addSection } = useCMS();


    return (<div className='cms-props-list-case'>
        <div className='cms-props-grid-body'>
            {templates.sections?.map((preset) => (
                <div key={preset.id} className='cms-props-grid-item' onClick={() => addSection(preset.template_key, preset.name)} title={preset.name}>
                    <div className='item-preview'>
                        {preset.preview_image ? (
                            <img src={preset.preview_image} alt={preset.name} />
                        ) : (
                            <Icon icon={icons.layoutGrid} size={24} />
                        )}
                    </div>
                    <div className='item-info'><b>{preset.name}</b> <p>{preset.category}</p> </div>
                </div>
            ))}
        </div>

        <div className='cms-props-list-head' style={{ marginTop: '10px' }}><h4>Full Themes</h4></div>
        <div className='cms-props-grid-body'>
            {templates.themes?.length > 0 && (
                <>
                    {
                        templates.themes.map((theme) => (
                            <div key={theme.id} className='cms-props-grid-item'>
                                <div className='item-preview'> <img src={theme.preview_image || '/defaults/no-image.webp'} alt={theme.name} /> </div>
                                <div className='item-info'> <b>{theme.name}</b> <p>{theme.category}</p> </div>
                            </div>
                        ))
                    }
                </>
            )}
        </div>
    </div>);


};

export default TemplateGallery;

