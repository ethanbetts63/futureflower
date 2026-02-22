import React from 'react';
import { ChevronRight } from 'lucide-react';
import floristMakingImage320 from '../../assets/florist_making_flowers-320w.webp';
import floristMakingImage640 from '../../assets/florist_making_flowers-640w.webp';
import floristMakingImage768 from '../../assets/florist_making_flowers-768w.webp';
import floristMakingImage1024 from '../../assets/florist_making_flowers-1024w.webp';
import floristMakingImage1280 from '../../assets/florist_making_flowers-1280w.webp';

const angles = [
  {
    label: 'The "Stop Using Big Flower Websites" Angle',
    description:
      'Explain how major online flower networks quietly take massive cuts from florists — leaving less money in the bouquet. FutureFlower caps commission at 15%, meaning more flowers for the same price.',
  },
  {
    label: 'The "Yearly Gift to Yourself"',
    description:
      'Encourage your audience to send flowers to their future self once a year. A birthday gift. A reminder. A "you made it" moment. Scheduled now, delivered when it matters most.',
  },
  {
    label: 'The "Mother\'s Day" Savior',
    description:
      'Remind your audience that the best gift is one that doesn\'t rely on a last-minute reminder.',
  },
  {
    label: 'The Unboxing',
    description:
      'Show the quality of a "Florist\'s Choice" bouquet — no supermarket bundles here.',
  },
];

export const ContentIdeasSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16 order-2 md:order-1">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How to share FutureFlower
            </h2>

            <ul className="space-y-5">
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
          </div>
        </div>

        {/* Image Column */}
        <div className="h-64 md:h-full order-1 md:order-2">
          <img
            src={floristMakingImage1280}
            srcSet={`${floristMakingImage320} 320w, ${floristMakingImage640} 640w, ${floristMakingImage768} 768w, ${floristMakingImage1024} 1024w, ${floristMakingImage1280} 1280w`}
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
