export interface FlowerPreferencesSummaryProps {
  flowerNotes?: string | null;
  /** Display label for the occasion (e.g. "Birthday"), shown above the notes. */
  occasion?: string | null;
  editUrl?: string;
  locked?: boolean;
}
