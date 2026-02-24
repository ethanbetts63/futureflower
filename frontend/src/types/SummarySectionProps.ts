import type { ReactNode } from 'react';

export interface SummarySectionProps {
  label: string;
  children: ReactNode;
  editUrl?: string;
  locked?: boolean;
}
