import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface UnifiedSummaryCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const UnifiedSummaryCard: React.FC<UnifiedSummaryCardProps> = ({ 
  title, 
  description, 
  children, 
  footer,
  className = ""
}) => {
  return (
    <Card className={`w-full bg-[#fcfaf8] shadow-xl shadow-black/5 border-none text-black overflow-hidden rounded-3xl ${className}`}>
      <CardHeader className="bg-[#fcfaf8] border-b border-black/5 p-4">
        <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">
          {title}
        </CardTitle>
        <CardDescription className="text-black/80 text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <div className="flex flex-col">
          {children}
        </div>
      </CardContent>
      {footer && (
        <CardFooter className="bg-[#fcfaf8] border-t border-black/5 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            {footer}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default UnifiedSummaryCard;
