import type { Plan } from './Plan';
import type { Color } from './Color';
import type { FlowerType } from './FlowerType';
import type { PartialPlan } from './PartialPlan';

export interface PreferencesCardProps {
    plan: Plan;
    colorMap: Map<number, Color>;
    flowerTypeMap: Map<number, FlowerType>;
    editUrl: string;
    getPlan: (planId: string) => Promise<Plan>;
    updatePlan: (planId: string, data: PartialPlan) => Promise<Plan>;
}
