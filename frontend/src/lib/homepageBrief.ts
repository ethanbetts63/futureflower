export const HOMEPAGE_BRIEF_STORAGE_KEY = 'futureflower.homepageBrief.v1';

export type HomepageBrief = {
  vibeId: number | null;
  vibeName: string;
  budget: number;
  flowerNotes: string;
  startDate?: string;
  cardMessage?: string;
};

export function formatHomepageFlowerNotes(brief: HomepageBrief) {
  const lines = [`Occasion / vibe: ${brief.vibeName}`];
  const notes = brief.flowerNotes.trim();

  if (notes) {
    lines.push(`Customer preferences: ${notes}`);
  }

  return lines.join('\n');
}
