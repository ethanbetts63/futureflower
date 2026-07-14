import { Flower2, Leaf, Palette } from 'lucide-react';

const benefits = [
  {
    icon: Leaf,
    audience: 'Better for the environment',
    text: 'No fixed recipes means florists can use the best flowers already on hand, so fewer stems go to waste.',
  },
  {
    icon: Palette,
    audience: 'Better for the florist',
    text: 'Less waste protects their margin, while creative freedom lets them be artists instead of assembly-line workers.',
  },
  {
    icon: Flower2,
    audience: 'Better for you',
    text: 'You get fresher flowers, original design, and more bouquet for your budget.',
  },
];

export const BetterForEveryoneSection = () => {
  return (
    <section className="bg-[#eaf1e7] py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-black font-playfair-display sm:text-3xl">
          No bouquet templates, no worries!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-black/15">
          {benefits.map(({ icon: Icon, audience, text }) => (
            <article key={audience} className="border-b border-black/15 py-6 sm:border-b-0 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-black" aria-hidden="true" />
                <h3 className="text-lg font-bold font-playfair-display">{audience}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-black/65">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
