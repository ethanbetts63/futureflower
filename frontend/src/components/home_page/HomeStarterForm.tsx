"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { FlowerType } from '@/types/FlowerType';
import { IMPACT_TIERS, MIN_BUDGET } from '@/utils/pricingConstants';
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
  { id: 0, name: 'Other', tagline: 'Describe it below' },
];

export default function HomeStarterForm() {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<FlowerType>(fallbackVibes[0]);
  const [budget, setBudget] = useState(IMPACT_TIERS[1]?.price ?? 125);
  const [customBudget, setCustomBudget] = useState('');
  const [flowerNotes, setFlowerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    const finalBudget = budget >= MIN_BUDGET ? budget : MIN_BUDGET;
    const brief: HomepageBrief = {
      vibeId: selectedVibe.id || null,
      vibeName: selectedVibe.name,
      budget: finalBudget,
      flowerNotes,
    };

    setIsSubmitting(true);
    window.sessionStorage.setItem(HOMEPAGE_BRIEF_STORAGE_KEY, JSON.stringify(brief));
    router.push('/event-gate/single-delivery');
  };

  const handleCustomBudgetChange = (value: string) => {
    setCustomBudget(value);
    const parsedValue = Number.parseInt(value, 10);

    if (!Number.isNaN(parsedValue)) {
      setBudget(Math.max(parsedValue, MIN_BUDGET));
    }
  };

  return (
    <div className="min-w-0 bg-white border-y border-black/10 shadow-xl shadow-black/5 rounded-none p-5 sm:p-6 lg:rounded-xl lg:border lg:p-7">
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
          <div className="-mx-5 mt-3 overflow-x-auto px-5 pb-3 pt-1 sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7">
            <div className="flex snap-x snap-mandatory gap-3">
            {IMPACT_TIERS.map((tier) => {
              const isSelected = budget === tier.price;

              return (
                <button
                  key={tier.price}
                  type="button"
                  onClick={() => setBudget(tier.price)}
                  className={`relative flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-lg border text-left transition ${
                    isSelected
                      ? 'border-black bg-white text-black shadow-md ring-1 ring-black'
                      : 'border-black/10 bg-white text-black hover:border-black/40'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                      Selected
                    </span>
                  )}
                  <span className="block h-36 w-full overflow-hidden bg-[#f8f3ef]">
                    <img
                      src={tier.image}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </span>
                  <span className="block p-3">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 break-words text-sm font-semibold">{tier.name}</span>
                      <span className="text-sm font-bold">${tier.price}</span>
                    </span>
                    <span className="mt-1 block break-words text-xs leading-snug text-black/55">
                      {tier.description}
                    </span>
                  </span>
                </button>
              );
            })}
            <div
              className={`relative flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-lg border bg-white text-left transition ${
                !IMPACT_TIERS.some((tier) => tier.price === budget)
                  ? 'border-black text-black shadow-md ring-1 ring-black'
                  : 'border-black/10 text-black'
              }`}
            >
              {!IMPACT_TIERS.some((tier) => tier.price === budget) && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                  Selected
                </span>
              )}
              <div className="flex h-36 items-center justify-center bg-[#f8f3ef] px-5">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
                    Custom
                  </p>
                  <p className="mt-2 text-3xl font-bold text-black font-playfair-display">
                    Your amount
                  </p>
                </div>
              </div>
              <div className="p-3">
                <label htmlFor="homepage-custom-budget" className="text-sm font-semibold text-black">
                  Custom Budget
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/45">$</span>
                  <input
                    id="homepage-custom-budget"
                    type="number"
                    min={MIN_BUDGET}
                    inputMode="numeric"
                    value={customBudget}
                    onChange={(event) => handleCustomBudgetChange(event.target.value)}
                    onFocus={() => {
                      if (!customBudget) {
                        setBudget(MIN_BUDGET);
                      }
                    }}
                    placeholder={String(MIN_BUDGET)}
                    className="h-11 w-full rounded-md border border-black/10 bg-white pl-7 pr-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black"
                  />
                </div>
                <p className="mt-2 text-xs leading-snug text-black/50">
                  Minimum ${MIN_BUDGET}. Delivery is included.
                </p>
              </div>
            </div>
            <div className="w-16 shrink-0 sm:w-24 lg:w-28" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section>
          <label htmlFor="homepage-flower-notes" className="text-sm font-semibold text-black">
            Custom Preferences
          </label>
          <textarea
            id="homepage-flower-notes"
            value={flowerNotes}
            onChange={(event) => setFlowerNotes(event.target.value)}
            placeholder="Describe the occasion, favourite colours, flowers they love, flowers to avoid, or the feeling you want."
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
