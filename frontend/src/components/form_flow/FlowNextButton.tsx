import React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Spinner } from '@/components/ui/spinner';

interface FlowNextButtonProps extends ButtonProps {
  label: string;
  isLoading?: boolean;
}

const FlowNextButton: React.FC<FlowNextButtonProps> = ({ 
  label, 
  isLoading, 
  className, 
  disabled, 
  children,
  asChild,
  ...props 
}) => {
  return (
    <Button
      asChild={asChild}
      className={cn(
        "bg-[var(--colorgreen)] text-black font-semibold px-8 py-6 rounded-xl hover:brightness-110 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4 min-w-[200px] border-none text-lg",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {asChild ? children : (
        <>
          <div className="flex items-center gap-2">
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            <span>{label.startsWith('Next:') ? label : `Next: ${label}`}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-black/40 group-hover:text-black transition-colors" />
        </>
      )}
    </Button>
  );
};

export default FlowNextButton;
