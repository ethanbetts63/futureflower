import type { FeaturePoint } from './FeaturePoint';

export interface DetailedProductInfoProps {
  subtitle: string;
  paragraph: string;
  features: FeaturePoint[];
  onGetStarted: () => void;
  buttonText?: string;
}
