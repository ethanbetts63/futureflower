import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface UnifiedSummaryCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const UnifiedSummaryCard: React.FC<UnifiedSummaryCardProps> = ({ title, description, children }) => {
  return (
    <Card className="w-full bg-white shadow-xl shadow-black/5 border-none text-black overflow-hidden rounded-3xl">
      <CardHeader className="bg-[#fcfaf8] border-b border-black/5 p-8 md:p-10">
        <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">
          {title}
        </CardTitle>
        <CardDescription className="text-black/50 text-base mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 md:p-10">
        <div className="flex flex-col">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedSummaryCard;
