import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import Icon from '../components/common/Icon';
import { icons } from '../config/icons';

const NotificationContext = createContext();

export const useNotifier = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((current) => current.filter((n) => n.id !== id));
    }, []);

    // 'fade', 'slide', 'zoom', 'bounce'
    // 'top-right', 'top-left', 'bottom-right','bottom-left'
    const notify = useCallback(({ title, message, style = 'info', duration = 3000, position = 'top-right', animation = 'fade', solid = true, hasTitle = true, }) => {
        const id = Math.random().toString(36).substr(2, 9);

        let defaultTitle = 'Notification';
        switch (style) {
            case 'success':
                defaultTitle = 'Success';
                break;
            case 'warning':
                defaultTitle = 'Warning';
                break;
            case 'error':
                defaultTitle = 'Error';
                break;
            case 'info':
                defaultTitle = 'Info';
                break;
            default:
                defaultTitle = 'Notice';
        }
        const finalTitle = title || defaultTitle;

        setNotifications((current) => [...current, { id, title: finalTitle, message, style, duration, position, animation, solid, hasTitle },]);
        setTimeout(() => { removeNotification(id); }, duration);
    },
        [removeNotification]
    );

    const notificationsByPosition = notifications.reduce((groups, n) => {
        const group = groups[n.position] || [];
        group.push(n);
        groups[n.position] = group;
        return groups;
    }, {});

    const value = useMemo(() => ({ notify }), [notify]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            {Object.entries(notificationsByPosition).map(([position, notifs]) => (
                <ToastContainer key={position} position={position} notifications={notifs} removeNotification={removeNotification} />
            ))}
        </NotificationContext.Provider>);
};

const iconMap = {
    success: icons.success,
    info: icons.info,
    warning: icons.warning,
    error: icons.error,
};

const ToastContainer = ({ notifications, removeNotification, position }) => {
    return (
        <div className={`toast-container ${position}`}>
            {notifications.map((n) => (<Toast key={n.id} {...n} onClose={() => removeNotification(n.id)} />))}
        </div>);
};

const Toast = ({ title, message, style, animation, solid, hasTitle, onClose }) => {
    const icon = iconMap[style] || icons.info;

    return (
        <div className={`toast-item toast-${style} toast-animation-${animation} ${solid === true ? style : ''} `}>
            <div className="toast-icon"> <Icon icon={icon} /> </div>
            <div className="toast-text-content">
                {hasTitle && <h4 className="toast-title" >{title}</h4>}
                <p className="toast-message" >{message}</p>
            </div>
            <button className="toast-close-btn" onClick={onClose}> <Icon icon={icons.close} /> </button>
        </div>);
};
