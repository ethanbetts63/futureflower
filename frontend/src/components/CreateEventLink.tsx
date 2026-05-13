import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import type { CreateEventLinkProps } from '../types/CreateEventLinkProps';

export const CreateEventLink = ({ children, className, variant, size }: CreateEventLinkProps) => {
  return (
    <Link
      href="/event-gate"
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {children || 'Create Event'}
    </Link>
  );
};
