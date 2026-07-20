import type { Order, PartialOrder } from '@/types/Order';

export type HomepageBrief = {
  occasion: string;
  budget: number;
  flowerNotes: string;
  startDate?: string;
  cardMessage?: string;
};

export function briefToOrderPatch(brief: HomepageBrief): PartialOrder {
  return {
    budget: brief.budget,
    occasion: brief.occasion || null,
    flower_notes: brief.flowerNotes,
    ...(brief.startDate ? { start_date: brief.startDate } : {}),
    ...(brief.cardMessage !== undefined ? { card_message: brief.cardMessage } : {}),
  };
}

export function orderToBrief(order: Order): HomepageBrief {
  return {
    occasion: order.occasion || '',
    budget: Number(order.budget) || 0,
    flowerNotes: order.flower_notes || '',
    startDate: order.start_date || undefined,
    cardMessage: order.card_message || '',
  };
}
