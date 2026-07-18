import type { Order, PartialOrder } from '@/types/Order';

// The brief the customer fills in on the homepage form. Occasion is a structured
// key (see lib/occasions); the customer's own words live in flowerNotes, kept
// separate so an edit can show the occasion picker again rather than a text dump.
export type HomepageBrief = {
  occasion: string;
  budget: number;
  flowerNotes: string;
  startDate?: string;
  cardMessage?: string;
};

/** Translate a brief into the fields patched onto a draft order. */
export function briefToOrderPatch(brief: HomepageBrief): PartialOrder {
  return {
    budget: brief.budget,
    occasion: brief.occasion || null,
    flower_notes: brief.flowerNotes,
    ...(brief.startDate ? { start_date: brief.startDate } : {}),
    ...(brief.cardMessage !== undefined ? { card_message: brief.cardMessage } : {}),
  };
}

/** Seed the form from an existing draft order, so returning to edit prefills it. */
export function orderToBrief(order: Order): HomepageBrief {
  return {
    occasion: order.occasion || '',
    budget: Number(order.budget) || 0,
    flowerNotes: order.flower_notes || '',
    startDate: order.start_date || undefined,
    cardMessage: order.card_message || '',
  };
}
