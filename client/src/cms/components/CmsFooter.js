import React, { useState } from 'react';
import Icon from "../../components/common/Icon";
import { icons } from "../../config/icons";

const CmsFooter = () => {
    const [zoom, setZoom] = useState(100);
    const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);

    React.useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (<div className='cms-editor-foot'>
        <div className='cms-editor-foot-cell'>
            <button title="Notes (Disabled)"><Icon icon={icons.edit} /><p>Notes</p> </button>
        </div>
        <div className='cms-editor-foot-cell'>
            <div className='cms-editor-zoom-case'>
                <input className='cms-editor-zoom' type='range' value={zoom} onChange={(e) => setZoom(e.target.value)} min={10} max={200} /> 
                <p>{zoom}%</p>
            </div>
            <div className='cms-editor-foot-dvr'></div>
            <button title="Layout Grid (Disabled)"><Icon icon={icons.layoutGrid} /></button>
            <button onClick={handleToggleFullScreen} title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}>
                <Icon icon={isFullScreen ? icons.minimize : icons.maximize} />
            </button>
            <button title="Help (Disabled)"><Icon icon={icons.help} /></button>
        </div>
    </div>);
};

export default CmsFooter;

