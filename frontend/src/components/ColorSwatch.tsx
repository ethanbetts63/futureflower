// foreverflower/frontend/src/components/preferences/ColorSwatch.tsx
import React from 'react';
import { cn } from "@/utils/utils";
import { Check } from 'lucide-react';
import type { ColorSwatchProps } from '../types/ColorSwatchProps';



export const ColorSwatch: React.FC<ColorSwatchProps> = ({ hex, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all duration-200",
        isSelected ? "border-black" : "border-gray-300 hover:border-gray-400"
      )}
      style={{ backgroundColor: hex }}
      aria-label={`Select color ${hex}`}
    >
      {isSelected && <Check className="h-6 w-6 text-white mix-blend-difference" />}
    </button>
  );
};
