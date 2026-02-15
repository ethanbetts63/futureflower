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
        "bg-[var(--colorgreen)] text-black font-normal px-6 py-3 rounded-xl hover:bg-[#22c55e] hover:shadow-xl transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4 min-w-[160px] border-none text-base",
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
          <ChevronRight className="h-4 w-4 text-black/40 group-hover:text-black transition-colors" />
        </>
      )}
    </Button>
  );
};

export default FlowNextButton;
