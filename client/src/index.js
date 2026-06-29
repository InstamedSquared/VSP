import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext';
import { NotificationProvider } from './context/NotificationContext';
import { PopupMenuProvider } from './context/PopupMenuContext';
import { TooltipProvider } from './context/TooltipContext';
import { CMSProvider } from './context/CMSContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './assets/css/base.css';
import './assets/css/fonts.css';
import './assets/css/components.css';
import './assets/css/loaders.css';
import './assets/css/admin.css';
import './assets/css/table.css';
import './assets/css/structure.css';
import './assets/css/kanban.css';


import './assets/css/web.css';
import './assets/css/webpages.css';
import './assets/cms/css/responsive-variables.css';

import './assets/css/template.css';
import './assets/css/delete.css';


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
        <ModalProvider>
            <NotificationProvider>
                <AuthProvider>
                    <CMSProvider>
                        <PopupMenuProvider>
                            <TooltipProvider>
                                <App />
                            </TooltipProvider>
                        </PopupMenuProvider>
                    </CMSProvider>
                </AuthProvider>
            </NotificationProvider>
        </ModalProvider>
    </QueryClientProvider>);
