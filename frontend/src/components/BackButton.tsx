import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/utils';
import type { BackButtonProps } from '../types/BackButtonProps';

const BackButton: React.FC<BackButtonProps> = ({ to, className, ...props }) => {
  const navigate = useNavigate();

  const buttonContent = (
    <>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </>
  );

  const buttonClassName = cn("font-bold", className);

  if (to) {
    return (
      <Button asChild variant="destructive" className={buttonClassName} {...props}>
        <Link to={to}>{buttonContent}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="destructive"
      onClick={() => navigate(-1)}
      className={buttonClassName}
      {...props}
    >
      {buttonContent}
    </Button>
  );
};

export default BackButton;

