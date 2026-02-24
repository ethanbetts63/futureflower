import type { FlowerType } from './FlowerType';

export interface FlowerPreferencesSummaryProps {
  preferredTypes: FlowerType[];
  flowerNotes?: string | null;
  editUrl: string;
  locked?: boolean;
}
