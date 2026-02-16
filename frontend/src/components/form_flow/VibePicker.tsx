import React from 'react';
import type { FlowerType } from '../../types/FlowerType';

import anniversaryImg from '@/assets/occasions/anniversary.png';
import birthdayImg from '@/assets/occasions/birthday.png';
import funeralImg from '@/assets/occasions/funeral.png';
import getWellImg from '@/assets/occasions/get_well.png';
import justBecauseImg from '@/assets/occasions/just_becuase.png';
import mothersDayImg from '@/assets/occasions/mothers_day.png';
import newBornImg from '@/assets/occasions/new_born.png';
import romanceImg from '@/assets/occasions/romance.png';
import sympathyImg from '@/assets/occasions/sympathy.png';
import thankYouImg from '@/assets/occasions/thank_you.png';
import weddingImg from '@/assets/occasions/wedding.png';
import medFlowers from '@/assets/med_flowers.png';

const OCCASION_IMAGES: Record<string, string> = {
  'Anniversary': anniversaryImg,
  'Birthday': birthdayImg,
  'Funeral': funeralImg,
  'Get Well': getWellImg,
  'Just Because': justBecauseImg,
  "Mother's Day": mothersDayImg,
  'New Born': newBornImg,
  'Romance': romanceImg,
  'Sympathy': sympathyImg,
  'Thank You': thankYouImg,
  'Wedding': weddingImg,
};

interface VibePickerProps {
  vibes: FlowerType[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export const VibePicker: React.FC<VibePickerProps> = ({ vibes, selected, onSelect }) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black font-['Playfair_Display',_serif]">
          What's the Vibe?
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Pick the occasion. It helps our florists nail the feel.
        </p>
      </div>

      {/* Scrollable cards */}
      <div className="-mx-4">
        <div className="flex gap-4 lg:gap-6 overflow-x-auto px-4 md:px-8 scroll-px-4 md:scroll-px-8 pt-4 pb-8 snap-x snap-mandatory scrollbar-hide">
          {vibes.map((vibe) => {
            const isSelected = selected === vibe.id;
            const image = OCCASION_IMAGES[vibe.name] || medFlowers;
            return (
              <button
                key={vibe.id}
                type="button"
                onClick={() => onSelect(isSelected ? null : vibe.id)}
                className={`relative bg-white rounded-2xl text-left transition-all cursor-pointer flex flex-col flex-shrink-0 w-44 snap-start ${
                  isSelected
                    ? 'ring-2 ring-[var(--colorgreen)] shadow-xl'
                    : 'shadow-md hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 flex items-center justify-center w-5 h-5 bg-[var(--colorgreen)] rounded-full z-10">
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}

                {/* Image */}
                <div className="w-full h-32 overflow-hidden rounded-t-2xl">
                  <img
                    src={image}
                    alt={vibe.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="px-4 py-3">
                  <span className="text-base font-bold text-gray-900 font-['Playfair_Display',_serif]">
                    {vibe.name}
                  </span>
                  {vibe.tagline && (
                    <p className="mt-0.5 text-xs text-gray-500 leading-snug">
                      {vibe.tagline}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
