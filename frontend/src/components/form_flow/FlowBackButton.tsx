import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/utils';

interface FlowBackButtonProps extends ButtonProps {
  to?: string;
  label?: string;
}

const FlowBackButton: React.FC<FlowBackButtonProps> = ({ 
  to, 
  label = "Back", 
  className, 
  onClick,
  ...props 
}) => {
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) return;
    }
    
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const content = (
    <>
      <div className="flex items-center gap-2">
        <ChevronLeft className="h-5 w-5 text-black/40 group-hover:text-black transition-colors" />
        <span>{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-black/10 group-hover:text-black/40 transition-colors" />
    </>
  );

  const baseClassName = cn(
    "bg-[var(--colorgreen)] text-black font-semibold px-8 py-6 rounded-xl hover:brightness-110 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4 min-w-[200px] border-none text-lg",
    className
  );

  if (to) {
    return (
      <Button asChild className={baseClassName} {...props}>
        <Link to={to}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleBack}
      className={baseClassName}
      {...props}
    >
      {content}
    </Button>
  );
};

export default FlowBackButton;
