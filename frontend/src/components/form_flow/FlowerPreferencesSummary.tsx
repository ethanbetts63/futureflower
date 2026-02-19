import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { OCCASION_IMAGES, DEFAULT_FLOWER_IMAGE } from '@/utils/flowerTypeImages';
import type { FlowerPreferencesSummaryProps } from '@/types/FlowerPreferencesSummaryProps';

const FlowerPreferencesSummary: React.FC<FlowerPreferencesSummaryProps> = ({ preferredTypes, flowerNotes, editUrl }) => {
  return (
    <div className="py-6 border-b border-black/5 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold tracking-[0.2em] text-black uppercase">
          Flower Preferences
        </span>
        <Link
          to={editUrl}
          className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
        >
          Edit
        </Link>
      </div>
      {preferredTypes.length > 0 ? (
        <div className="flex items-start gap-5">
          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-black/5 flex-shrink-0">
            <img
              src={OCCASION_IMAGES[preferredTypes[0].name] || DEFAULT_FLOWER_IMAGE}
              alt={preferredTypes[0].name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-xl font-bold text-black font-['Playfair_Display',_serif]">
              {preferredTypes[0].name}
            </h4>
            {preferredTypes[0].tagline && (
              <p className="text-sm text-black/60 leading-relaxed mt-1">
                {preferredTypes[0].tagline}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Sprout className="h-5 w-5 text-black/20 flex-shrink-0" />
          <span className="text-black/40 italic">Florist's choice of seasonal blooms</span>
        </div>
      )}
      {flowerNotes && (
        <div className="bg-black/5 p-4 rounded-xl text-sm text-black/70 italic mt-4">
          <span className="font-semibold">Notes for florist:</span> {flowerNotes}
        </div>
      )}
    </div>
  );
};

export default FlowerPreferencesSummary;
