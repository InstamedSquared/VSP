import React from 'react';

const Icon = ({ icon: IconComponent, size = 17, strokeWidth = 1.6, color = 'currentColor', className = '', ...props }) => {
    if (!IconComponent) return null;

    if (typeof IconComponent === 'string') {
        return (
            <span
                className={`icon-text-fallback ${className}`}
                style={{ fontSize: size, color, fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}
                {...props}
            >
                {IconComponent}
            </span>
        );
    }

    return <IconComponent size={size} strokeWidth={strokeWidth} color={color} className={`lucide-icon ${className}`} {...props} />;
};

export default Icon;
