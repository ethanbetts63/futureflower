import type { ButtonProps } from '../components/ui/button';

export interface EditButtonProps extends Omit<ButtonProps, 'asChild' | 'children'> {
  to: string;
}
