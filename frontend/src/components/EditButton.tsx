import { Link } from 'react-router-dom';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { cn } from '@/utils/utils';

interface EditButtonProps extends Omit<ButtonProps, 'asChild' | 'children'> {
  to?: string;
}

// This component has two return statements to handle two different scenarios:
// 1. If a 'to' prop is NOT provided, it returns a disabled button.
// 2. If a 'to' prop IS provided, it returns a functional button that links to the specified path.
const EditButton: React.FC<EditButtonProps> = ({ to, className, ...props }) => {
  const buttonClasses = cn("shadow-md", className);

  // Case 1: No 'to' prop, so the button is disabled.
  if (!to) {
    return (
        <Button variant="default" size="sm" disabled className={buttonClasses} {...props}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
    );
  }
  
  // Case 2: 'to' prop is present, so the button is a clickable link.
  return (
    <Button asChild variant="default" size="sm" className={buttonClasses} {...props}>
      <Link to={to}>
        <Pencil className="mr-2 h-4 w-4" /> Edit
      </Link>
    </Button>
  );
};

export default EditButton;
