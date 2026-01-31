import type { FeaturePoint } from './FeaturePoint';

export interface ProductData {
    content: {
        subtitle: string;
        paragraph: string;
        features: FeaturePoint[];
    };
    onGetStarted: () => void;
}
