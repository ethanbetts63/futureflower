import type { ReactNode } from 'react';

export interface BadgeProps {
  title: string;
  subtext: string;
  symbol: ReactNode;
  className?: string;
}
