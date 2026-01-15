import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getAppConfig } from '@/api';
import type { AppConfig } from '@/types';

// --- Type Definitions ---
interface ConfigContextType {
  config: AppConfig | null;
  isLoading: boolean;
  error: string | null;
  loadConfig: () => Promise<void>;
}

// --- Context Creation ---
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// --- Provider Component ---
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    // Prevent re-fetching if data is already loaded or is currently loading
    if (config || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const configData = await getAppConfig();
      setConfig(configData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch app configuration.');
    } finally {
      setIsLoading(false);
    }
  }, [config, isLoading]);

  const value = {
    config,
    isLoading,
    error,
    loadConfig,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

// --- Custom Hook ---
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
