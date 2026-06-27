import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useModal } from '../../context/ModalContext';
import Icon from '../common/Icon';
import { icons } from '../../config/icons';

const Modal = () => {
    const { isOpen, closePopup, modalContent } = useModal();
    const { widthClass, title, content, actions, animation, closeOnBackdropClick, isDraggable, isAlert, style, duration, } = modalContent;
    const nodeRef = useRef(null);

    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => { closePopup(); }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, closePopup]);

    if (!isOpen) { return null; }
    const handleBackdropClick = (e) => { if (closeOnBackdropClick && e.target === e.currentTarget) { closePopup(); } };

    //success, error, warning, info
    const renderIcon = () => {
        switch (style) {
            case 'success':
                return (<div className='alert-icon'><div className='alert-checkmark'> <div className='checkmark-stem'></div><div className='checkmark-kick'></div> </div></div>);
            case 'error':
                return (<div className='alert-icon'><div className='alert-error'> <div className='error-line left'></div><div className='error-line right'></div> </div></div>);
            case 'info':
                return (<div className='alert-icon'><div className='info-circle'><h5>i</h5></div></div>);
            case 'warning':
                return (<div className='alert-icon'><div className='warning-circle'><h5>!</h5></div></div>);
            default:
                return null;
        }
    };

    const modalPanel = (
        <div ref={nodeRef} className={`modal-panel ${widthClass}`}>
            <div className={`modal-content-wrapper modal-animation-${animation}`}>
                {isAlert === false ? (
                    <>
                        <header className='modal-header'> <h2>{title === '' ? 'Pop-up Form' : title}</h2> <button onClick={closePopup} className='modal-close-btn'>&times;</button> </header>
                        <main className='modal-content'> {content} </main>
                        {actions && actions.length > 0 && (
                            <footer className='modal-actions'>
                                {actions.map((action, index) => (<button key={index} onClick={action.onClick} className={`button ${action.className || ''}`} > {action.icon && <Icon icon={action.icon} />} {action.text}</button>))}
                            </footer>)}
                    </>)
                    :
                    (<div className='alert-wrap'>
                        {renderIcon()}
                        {title !== '' ? (<div className='alert-title'><h2>{title}</h2></div>) : ''}
                        {content !== '' ? (<main className='alert-content'> {content} </main>) : ''}
                        <div className='alert-foot'> {actions.length <= 0 ? <button className='button' onClick={closePopup} >OK</button> : actions.map((action, index) => (<button key={index} onClick={action.onClick} className={`button ${action.className || ''}`} > {action.icon && <Icon icon={action.icon} />} {action.text}</button>))} </div>
                    </div>)}
            </div>
        </div>);

    return (
        <div className='modal-backdrop' onClick={handleBackdropClick}>
            {isDraggable ? (
                <Draggable
                    nodeRef={nodeRef}
                    handle='.modal-header'
                    cancel='.modal-content, .modal-actions, .modal-close-btn'
                    positionOffset={{ x: '-50%', y: '-50%' }}
                >
                    {modalPanel}
                </Draggable>
            ) : (modalPanel)}
        </div>);
};

export default Modal;