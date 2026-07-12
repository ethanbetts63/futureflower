import { ChevronRight } from 'lucide-react';
import { BecomePartnerButton } from '../florists_page/BecomePartnerButton';
import floristMakingImage320 from '../../assets/florist_making_flowers-320w.webp';
import floristMakingImage640 from '../../assets/florist_making_flowers-640w.webp';
import floristMakingImage768 from '../../assets/florist_making_flowers-768w.webp';
import floristMakingImage1024 from '../../assets/florist_making_flowers-1024w.webp';
import floristMakingImage1280 from '../../assets/florist_making_flowers-1280w.webp';
import { assetSrc } from '@/lib/assets';

const angles = [
  {
    label: 'The "Don\'t Know Flowers? You Don\'t Need To" Angle',
    description:
      'Most people buying flowers have no idea what they\'re looking at. Show how giving a budget and a vibe to an actual florist beats guessing between lookalike catalog photos.',
  },
  {
    label: 'The "Support Local" Angle',
    description:
      'Every order is made and delivered by a real local florist under their own name — not a warehouse box with a courier label.',
  },
  {
    label: 'The Unboxing',
    description:
      'Show the quality of a custom florist-designed bouquet — no supermarket bundles here.',
  },
];

export const ContentIdeasSection = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16 order-2 md:order-1">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How to share FutureFlower
            </h2>

            <ul className="space-y-5 mb-8">
              {angles.map((angle, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-900">{angle.label}: </span>
                    <span className="text-gray-600">{angle.description}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-center">
              <BecomePartnerButton />
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div className="h-64 md:h-full order-1 md:order-2">
          <img
            src={assetSrc(floristMakingImage1280)}
            srcSet={`${assetSrc(floristMakingImage320)} 320w, ${assetSrc(floristMakingImage640)} 640w, ${assetSrc(floristMakingImage768)} 768w, ${assetSrc(floristMakingImage1024)} 1024w, ${assetSrc(floristMakingImage1280)} 1280w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="Florist arranging flowers"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
};
