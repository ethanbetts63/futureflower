import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import * as api from '@/api';
import type { UserProfile } from '../types/UserProfile';
import type { AuthContextType } from '../types/AuthContextType';

// --- Context Creation ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    try {
      const fullProfile = await api.getUserProfile();
      setUser(fullProfile);
    } catch (error: any) {
      // Only clear the user on authentication errors — don't log out on network blips
      const status = error.data?.status || error.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('hasSession');
        setUser(null);
      } else {
        console.warn("Failed to fetch user profile due to network/server error. Retaining session.", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // On initial load, only attempt to restore the session if we have a stored
    // indicator that a session was previously established. This avoids firing
    // guaranteed-to-fail 401 requests for unauthenticated visitors.
    if (!localStorage.getItem('hasSession')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    loadUserProfile();
  }, [loadUserProfile]);

  useEffect(() => {
    const handleAuthFailure = () => {
      console.log("Authentication failure event received. Logging out.");
      logout();
    };

    window.addEventListener('auth-failure', handleAuthFailure);

    return () => {
      window.removeEventListener('auth-failure', handleAuthFailure);
    };
  }, []);

  /**
   * Central handler for successful authentication.
   * Tokens are already set as HttpOnly cookies by the server — we just
   * need to load the user profile to populate the context.
   */
  const handleLoginSuccess = async () => {
    localStorage.setItem('hasSession', '1');
    setIsLoading(true);
    await loadUserProfile();
  };

  /**
   * Login handler for the traditional email/password form.
   */
  const loginWithPassword = async (email: string, password: string) => {
    try {
      await api.loginUser(email, password);
      await handleLoginSuccess();
    } catch (error) {
      throw error;
    }
  };

  /**
   * Calls the server logout endpoint to clear HttpOnly cookies, then clears local state.
   */
  const logout = async (onLogoutSuccess?: () => void) => {
    localStorage.removeItem('hasSession');
    try {
      await api.logoutUser();
    } catch {
      // If the logout request fails (e.g. already expired), still clear local state
    }
    setUser(null);
    if (onLogoutSuccess) {
      onLogoutSuccess();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithPassword,
    handleLoginSuccess,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
