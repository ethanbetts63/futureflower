import type { Plan } from './Plan';
import type { FlowerType } from './FlowerType';

export interface PlanDisplayProps<T extends Plan = Plan> {
    children: (data: {
        plan: T;
        flowerTypeMap: Map<number, FlowerType>;
    }) => React.ReactNode;
    fallbackNavigationPath?: string;
    getPlan: (planId: string) => Promise<T>;
}
