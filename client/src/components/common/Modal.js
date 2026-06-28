import React, { useEffect } from 'react';
import Icon from './Icon';
import { icons } from '../../config/icons';

const Modal = ({ isOpen, onClose, title, children, widthClass = 'w-md', actions = [] }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={`modal-panel ${widthClass}`}>
                <div className="modal-content-wrapper modal-animation-fade">
                    <header className="modal-header">
                        <h2>{title}</h2>
                        <button type="button" className="modal-close-btn" onClick={onClose}>
                            &times;
                        </button>
                    </header>
                    <main className="modal-content">
                        {children}
                    </main>
                    {actions && actions.length > 0 && (
                        <footer className='modal-actions'>
                            {actions.map((action, index) => (
                                <button key={index} onClick={action.onClick} className={`button ${action.className || ''}`} >
                                    {action.icon && <Icon icon={action.icon} />} {action.text}
                                </button>
                            ))}
                        </footer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
