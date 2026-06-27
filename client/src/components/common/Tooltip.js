import React from 'react';
import { useTooltip } from '../../context/TooltipContext';

const Tooltip = ({ children, content, placement='top', theme='dark' }) => {
    const { showTooltip, hideTooltip } = useTooltip();
  
    if(!content){ return children; }
    const child = React.Children.only(children);
  
    if(!React.isValidElement(child)){ return children; }
  
    const handleMouseEnter = (e) => {
        if(child.props.onMouseEnter){ child.props.onMouseEnter(e); }
        showTooltip({referenceElement: e.currentTarget, content, placement, theme, });
    };

    const handleMouseLeave = (e) => {
        if(child.props.onMouseLeave){ child.props.onMouseLeave(e); }
        hideTooltip();
    };
    
    return React.cloneElement(child, {onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave,});
};

export default Tooltip;