import type { Order } from '@/types/Order';

/**
 * Django serialises Decimal fields as strings, so money arrives as `"125.00"`
 * and has to be coerced.
 *
 * The coercion is deliberately loud. A missing or non-numeric amount means the
 * API contract has broken, and quietly substituting `0` would show the customer
 * a wrong price — or charge them one. Crash here, where the cause is obvious,
 * rather than three components later.
 */
function money(value: unknown, field: string): number {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    throw new Error(`Order.${field}: expected a numeric amount, got ${JSON.stringify(value)}`);
  }
  return amount;
}

function nullableMoney(value: unknown, field: string): number | null {
  return value === null || value === undefined ? null : money(value, field);
}

function list(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Order.${field}: expected an array, got ${JSON.stringify(value)}`);
  }
  return value;
}

/** Turn a raw order payload into an Order, or throw explaining why it isn't one. */
export function parseOrder(raw: unknown): Order {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error(`Expected an order object, got ${JSON.stringify(raw)}`);
  }

  const order = raw as Record<string, unknown>;

  return {
    ...order,
    budget: nullableMoney(order.budget, 'budget'),
    subtotal: money(order.subtotal, 'subtotal'),
    discount_amount: money(order.discount_amount, 'discount_amount'),
    total_amount: nullableMoney(order.total_amount, 'total_amount'),
    events: list(order.events, 'events'),
    payments: list(order.payments, 'payments'),
  } as Order;
}
