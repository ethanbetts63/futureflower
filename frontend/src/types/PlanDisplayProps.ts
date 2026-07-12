import type { Order } from './Order';
import type { FlowerType } from './FlowerType';

export interface PlanDisplayProps<T extends Order = Order> {
    children: (data: {
        plan: T;
        flowerTypeMap: Map<number, FlowerType>;
        refreshPlan: () => Promise<void>;
    }) => React.ReactNode;
    fallbackNavigationPath?: string;
    getPlan: (planId: string) => Promise<T>;
}
