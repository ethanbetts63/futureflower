"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { FlowerType } from '@/types/FlowerType';
import { IMPACT_TIERS } from '@/utils/pricingConstants';
import {
  HOMEPAGE_BRIEF_STORAGE_KEY,
  type HomepageBrief,
} from '@/lib/homepageBrief';

const fallbackVibes: FlowerType[] = [
  { id: 0, name: 'Birthday', tagline: 'Warm, bright, celebratory' },
  { id: 0, name: 'Romance', tagline: 'Soft, intimate, considered' },
  { id: 0, name: 'Sympathy', tagline: 'Gentle, calm, respectful' },
  { id: 0, name: 'Thank You', tagline: 'Polished, generous, sincere' },
  { id: 0, name: 'Just Because', tagline: 'Fresh, seasonal, easy' },
];

export default function HomeStarterForm() {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<FlowerType>(fallbackVibes[0]);
  const [budget, setBudget] = useState(IMPACT_TIERS[1]?.price ?? 125);
  const [flowerNotes, setFlowerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    const brief: HomepageBrief = {
      vibeId: selectedVibe.id || null,
      vibeName: selectedVibe.name,
      budget,
      flowerNotes,
    };

    setIsSubmitting(true);
    window.sessionStorage.setItem(HOMEPAGE_BRIEF_STORAGE_KEY, JSON.stringify(brief));
    router.push('/event-gate/single-delivery');
  };

  return (
    <div className="min-w-0 bg-white border border-black/10 shadow-xl shadow-black/5 rounded-none sm:rounded-xl p-5 sm:p-6 lg:p-7">
      <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
            Step 1
          </p>
          <h2 className="mt-1 break-words text-2xl font-bold text-black font-playfair-display">
            Tell the florist what to make
          </h2>
        </div>
        <span className="hidden sm:inline-flex rounded-full bg-[var(--colorgreen)] px-3 py-1 text-xs font-semibold text-black">
          Australia
        </span>
      </div>

      <div className="mt-5 space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-black">Occasion</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-3">
            {fallbackVibes.map((vibe) => {
              const isSelected = selectedVibe.name === vibe.name;

              return (
                <button
                  key={`${vibe.id}-${vibe.name}`}
                  type="button"
                  onClick={() => setSelectedVibe(vibe)}
                  className={`min-h-20 min-w-0 rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? 'border-black bg-black text-white shadow-md'
                      : 'border-black/10 bg-white text-black hover:border-black/40'
                  }`}
                >
                  <span className="block break-words text-sm font-semibold">{vibe.name}</span>
                  {vibe.tagline && (
                    <span className={`mt-1 block break-words text-xs leading-snug ${isSelected ? 'text-white/70' : 'text-black/50'}`}>
                      {vibe.tagline}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-black">Budget</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {IMPACT_TIERS.map((tier) => {
              const isSelected = budget === tier.price;

              return (
                <button
                  key={tier.price}
                  type="button"
                  onClick={() => setBudget(tier.price)}
                  className={`min-w-0 rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? 'border-[var(--colorgreen)] bg-[var(--colorgreen)] text-black shadow-md'
                      : 'border-black/10 bg-white text-black hover:border-black/40'
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="min-w-0 break-words text-sm font-semibold">{tier.name}</span>
                    <span className="text-sm font-bold">${tier.price}</span>
                  </span>
                  <span className="mt-1 block break-words text-xs leading-snug text-black/55">
                    {tier.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <label htmlFor="homepage-flower-notes" className="text-sm font-semibold text-black">
            Preferences
          </label>
          <textarea
            id="homepage-flower-notes"
            value={flowerNotes}
            onChange={(event) => setFlowerNotes(event.target.value)}
            placeholder="Favourite colours, flowers they love, flowers to avoid, or the feeling you want."
            className="mt-3 min-h-28 w-full resize-none rounded-lg border border-black/10 bg-white p-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black"
          />
        </section>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-6 flex w-full items-center justify-between rounded-lg bg-black px-5 py-4 text-left text-white transition hover:bg-black/85 disabled:cursor-wait disabled:opacity-70"
      >
        <span>
          <span className="block text-sm font-semibold">Next: Delivery Details</span>
          <span className="mt-0.5 block text-xs text-white/60">
            We will save this brief for your florist.
          </span>
        </span>
        <ChevronRight className="h-5 w-5 text-white/70" />
      </button>
    </div>
  );
}
