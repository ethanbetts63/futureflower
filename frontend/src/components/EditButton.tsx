import { Link } from 'react-router-dom';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { cn } from '@/utils/utils';
import type { EditButtonProps } from '@/types/components';



const EditButton: React.FC<EditButtonProps> = ({ to, className, ...props }) => {
  const buttonClasses = cn("shadow-md", className);

  return (
    <Button asChild variant="default" size="sm" className={buttonClasses} {...props}>
      <Link to={to}>
        <Pencil className="mr-2 h-4 w-4" /> Edit
      </Link>
    </Button>
  );
};

export default EditButton;
