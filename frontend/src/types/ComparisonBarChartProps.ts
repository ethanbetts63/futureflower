import type { BarChartEntry } from './BarChartEntry';
import type { LegendItem } from './LegendItem';

export interface ComparisonBarChartProps {
  heading: string;
  bars: BarChartEntry[];
  legend: LegendItem[];
}
