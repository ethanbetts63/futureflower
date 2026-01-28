import type { AppConfig } from './config';
import type { UserProfile } from './users';
import type { AuthResponse } from './auth';

export interface NavItem {
    to: string;
    label: string;
}

export interface NavigationContextType {
    dashboardNavItems: NavItem[];
    setDashboardNavItems: (items: NavItem[]) => void;
}

export interface ConfigContextType {
  config: AppConfig | null;
  isLoading: boolean;
  error: string | null;
  loadConfig: () => Promise<void>;
}

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  handleLoginSuccess: (authResponse: AuthResponse) => Promise<void>;
  logout: (onLogoutSuccess?: () => void) => void;
}
