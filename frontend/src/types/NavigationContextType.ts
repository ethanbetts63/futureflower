import type { NavItem } from './NavItem';

export interface NavigationContextType {
    dashboardNavItems: NavItem[];
    setDashboardNavItems: (items: NavItem[]) => void;
}
