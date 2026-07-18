// The delivery frequencies for a subscription. `value` is the stored key (must
// match Order.FREQUENCY_CHOICES on the backend); `label` is what the customer
// sees. This is the single frontend source — don't inline the list elsewhere.
export type Frequency = { value: string; label: string };

export const FREQUENCIES: Frequency[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
];

export function frequencyLabel(value: string | null | undefined): string | null {
  return FREQUENCIES.find((frequency) => frequency.value === value)?.label ?? null;
}
