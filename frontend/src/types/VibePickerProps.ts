import type { FlowerType } from './FlowerType';

export interface VibePickerProps {
  vibes: FlowerType[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}
