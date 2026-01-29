// foreverflower/frontend/src/components/preferences/SelectableTag.tsx
import React from 'react';
import { Badge } from "@/components/ui/badge";
import type { SelectableTagProps } from '@/types/component_props';

export const SelectableTag: React.FC<SelectableTagProps> = ({ label, isSelected, onClick }) => {
  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      onClick={onClick}
      className="cursor-pointer transition-all duration-200 text-base text-black"
    >
      {label}
    </Badge>
  );
};
