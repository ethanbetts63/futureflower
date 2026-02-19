import type { ReactNode } from 'react';

export interface UnifiedSummaryCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}
