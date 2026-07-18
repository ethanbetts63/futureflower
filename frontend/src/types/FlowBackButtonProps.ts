import type { ButtonProps } from '@/shared_components/ui/button';

export interface FlowBackButtonProps extends ButtonProps {
  to?: string;
  label?: string;
}
