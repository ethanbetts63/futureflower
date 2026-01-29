import type { AppConfig } from './AppConfig';

export interface ConfigContextType {
  config: AppConfig | null;
  isLoading: boolean;
  error: string | null;
  loadConfig: () => Promise<void>;
}
