import React, { createContext, useState, useContext, type ReactNode } from 'react';

import type { NavItem } from '../types/NavItem';
import type { NavigationContextType } from '../types/NavigationContextType';

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dashboardNavItems, setDashboardNavItems] = useState<NavItem[]>([]);

    return (
        <NavigationContext.Provider value={{ dashboardNavItems, setDashboardNavItems }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
