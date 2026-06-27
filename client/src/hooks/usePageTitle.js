import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import titleConfig from '../config/titles.json';

const titleStore = {
    title: null,
    listeners: new Set(),
    setTitle(newTitle){ if(this.title !== newTitle){this.title = newTitle; this.listeners.forEach(listener => listener(this.title)); } },
    subscribe(listener){ this.listeners.add(listener); return () => this.listeners.delete(listener); },
};

export const setPageTitle = (title) => { titleStore.setTitle(title); };

const capitalize = (s) => { 
    if(typeof s !== 'string' || s.length === 0) return ''; 
    return s.charAt(0).toUpperCase() + s.slice(1); 
};

const usePageTitle = () => {
    const location = useLocation();
    const [dynamicTitle, setDynamicTitle] = useState(titleStore.title);

    useEffect(() => {
        const unsubscribe = titleStore.subscribe(setDynamicTitle);
        return unsubscribe;
    }, []);

    useEffect(() => {
        setPageTitle(null);
    }, [location]);
    
    useEffect(() => {
        const { pathname } = location;
        const { baseTitle, pageTitles } = titleConfig;

        if(dynamicTitle) {
            if(dynamicTitle.includes('|')) { document.title = dynamicTitle; } 
            else{ document.title = `${dynamicTitle} | ${baseTitle}`; }
            return;
        }

        if (Object.prototype.hasOwnProperty.call(pageTitles, pathname)) {
            const definedTitle = pageTitles[pathname];
            document.title = definedTitle.replace('{baseTitle}', baseTitle);
            return;
        }

        const pathSegments = pathname.split('/').filter(Boolean);
        const lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
        const pageName = lastSegment.length > 20 && pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : lastSegment;

        if(pageName){ document.title = `${capitalize(pageName)} | ${baseTitle}`; } 
        else{ document.title = baseTitle; }

    }, [location, dynamicTitle]);
};

export default usePageTitle;