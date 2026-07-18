// The occasion is guidance for the florist, stored as its own field on the order
// (Order.OCCASION_CHOICES on the backend). `value` is the stored key; `name` is
// what the customer sees. Keep this list in step with the model's choices.
export type Occasion = { value: string; name: string; tagline: string };

export const OCCASIONS: Occasion[] = [
  { value: 'birthday', name: 'Birthday', tagline: 'Warm, bright, celebratory' },
  { value: 'romance', name: 'Romance', tagline: 'Soft, intimate, considered' },
  { value: 'sympathy', name: 'Sympathy', tagline: 'Gentle, calm, respectful' },
  { value: 'thank_you', name: 'Thank You', tagline: 'Polished, generous, sincere' },
  { value: 'just_because', name: 'Just Because', tagline: 'Fresh, seasonal, easy' },
  { value: 'other', name: 'Other', tagline: 'Describe it below' },
];

export function occasionByValue(value: string | null | undefined): Occasion | undefined {
  return OCCASIONS.find((occasion) => occasion.value === value);
}

export function occasionByName(name: string | null | undefined): Occasion | undefined {
  return OCCASIONS.find((occasion) => occasion.name === name);
}

export function occasionLabel(value: string | null | undefined): string | null {
  return occasionByValue(value)?.name ?? null;
}
