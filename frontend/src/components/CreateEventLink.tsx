import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import type { CreateEventLinkProps } from '../types/CreateEventLinkProps';

export const CreateEventLink: React.FC<CreateEventLinkProps> = ({ children, className, variant, size }) => {
  return (
    <Link
      to="/event-gate"
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {children || 'Create Event'}
    </Link>
  );
};
