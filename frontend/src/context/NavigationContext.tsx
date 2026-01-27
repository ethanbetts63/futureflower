import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface NavItem {
    to: string;
    label: string;
}

interface NavigationContextType {
    dashboardNavItems: NavItem[];
    setDashboardNavItems: (items: NavItem[]) => void;
}

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
