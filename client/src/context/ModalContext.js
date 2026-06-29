import React, { createContext, useState, useContext, useMemo } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        widthClass: '',
        title: '',
        content: null,
        actions: [],
        closeOnBackdropClick: true,
        isDraggable: true,
        isAlert: false,
        duration: 0,
        animation: 'slide',
        style: '',
    });

    const openPopup = ({
        widthClass = 'w-md',
        title = '',
        content,
        actions = [],
        closeOnBackdropClick = false,
        isDraggable = true,
        isAlert = false,
        duration = 0,
        animation = 'slide',    // 'slide', 'fade', 'zoom', 'bounce'
        style = '',               // success, error, warning, info        
    }) => {
        setModalContent({ widthClass, title, content, actions, animation, closeOnBackdropClick, isDraggable, isAlert, style, duration, });
        setIsOpen(true);
    };

    const closePopup = () => {
        setIsOpen(false);
        setTimeout(() => setModalContent({ content: null }), 300);
    };

    const showAlert = (config) => {
        openPopup({
            ...config,
            isAlert: true
        });
    };

    const value = useMemo(() => ({
        isOpen,
        openPopup,
        closePopup,
        showAlert,
        modalContent
    }), [isOpen, modalContent]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>);
};