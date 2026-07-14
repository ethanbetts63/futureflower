import { startGuestCheckout } from '@/api/guestCheckout';
import type { Order, PartialOrder } from '@/types/Order';

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

/** Read the homepage brief saved before the account-creation detour, if any. */
export function readHomepageBrief(): HomepageBrief | null {
  try {
    const raw = window.sessionStorage.getItem(HOMEPAGE_BRIEF_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearHomepageBrief() {
  try {
    window.sessionStorage.removeItem(HOMEPAGE_BRIEF_STORAGE_KEY);
  } catch {
    /* sessionStorage unavailable — nothing to clear */
  }
}

/** Translate a homepage brief into the fields patched onto a draft order. */
export function briefToOrderPatch(brief: HomepageBrief): PartialOrder {
  return {
    budget: brief.budget,
    preferred_flower_types: brief.vibeId ? [brief.vibeId] : [],
    flower_notes: formatHomepageFlowerNotes(brief),
    ...(brief.startDate ? { start_date: brief.startDate } : {}),
    ...(brief.cardMessage !== undefined
      ? { draft_card_messages: { '0': brief.cardMessage } }
      : {}),
  };
}

/**
 * Find-or-create the signed-in user's draft order and apply the brief to it.
 * Shared by the homepage form (logged-in path) and the post-registration flow.
 */
export async function startOrderFromBrief(brief: HomepageBrief): Promise<Order> {
  return startGuestCheckout(brief);
}
