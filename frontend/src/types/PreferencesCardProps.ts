import type { Plan } from './Plan';
import type { FlowerType } from './FlowerType';

export interface PreferencesCardProps {
    plan: Plan;
    flowerTypeMap: Map<number, FlowerType>;
    editUrl: string;
}
