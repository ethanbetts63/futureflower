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
