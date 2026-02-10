import type { Plan } from './Plan';
import type { Color } from './Color';
import type { FlowerType } from './FlowerType';

export interface PlanDisplayProps<T extends Plan = Plan> {
    children: (data: {
        plan: T;
        colorMap: Map<number, Color>;
        flowerTypeMap: Map<number, FlowerType>;
    }) => React.ReactNode;
    fallbackNavigationPath?: string;
    getPlan: (planId: string) => Promise<T>;
}
