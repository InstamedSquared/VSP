import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const HeaderTabContext = createContext();
export const useHeaderTab = () => useContext(HeaderTabContext);

export const HeaderTabProvider = ({ children }) => {

    const [headerTabs, setHeaderTabs] = useState(null);
    const displayHeaderTabs = useCallback((tabConfig) => { setHeaderTabs(tabConfig); }, []);

    // Function to clear the tabs
    const clearHeaderTabs = useCallback(() => { setHeaderTabs(null); }, []);

    const value = useMemo(() => ({
        headerTabs,
        displayHeaderTabs,
        clearHeaderTabs
    }), [headerTabs, displayHeaderTabs, clearHeaderTabs]);

    return (
        <HeaderTabContext.Provider value={value}>
            {children}
        </HeaderTabContext.Provider>);
};