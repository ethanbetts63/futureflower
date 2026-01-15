import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import type { VariantProps } from 'class-variance-authority';

// Allow variant and size props to be passed through
interface CreateEventLinkProps extends VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  className?: string;
}

export const CreateEventLink: React.FC<CreateEventLinkProps> = ({ children, className, variant, size }) => {
  return (
    <Link
      to="/event-gate"
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {children || 'Secure Your Reminder'}
    </Link>
  );
};
