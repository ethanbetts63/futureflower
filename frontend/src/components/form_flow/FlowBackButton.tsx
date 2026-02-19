import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/utils/utils';
import type { FlowBackButtonProps } from '@/types/FlowBackButtonProps';

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
    <div className="flex items-center gap-2">
      <ChevronLeft className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
      <span>{label}</span>
    </div>
  );

  const baseClassName = cn(
    "bg-red-500 text-white font-normal px-6 py-3 rounded-xl hover:bg-red-600 transition-all cursor-pointer group shadow-lg flex items-center gap-4 min-w-[120px] border-none text-base",
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
