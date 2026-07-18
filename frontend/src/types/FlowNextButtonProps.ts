import type { ButtonProps } from '@/shared_components/ui/button';

export interface FlowNextButtonProps extends ButtonProps {
  label: string;
  isLoading?: boolean;
}
