import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { cn } from '@/utils/utils';
import type { EditButtonProps } from '../types/EditButtonProps';



const EditButton = ({ to, className, ...props }: EditButtonProps) => {
  const buttonClasses = cn("shadow-md", className);

  return (
    <Button asChild variant="default" size="sm" className={buttonClasses} {...props}>
      <Link href={to}>
        <Pencil className="mr-2 h-4 w-4" /> Edit
      </Link>
    </Button>
  );
};

export default EditButton;
