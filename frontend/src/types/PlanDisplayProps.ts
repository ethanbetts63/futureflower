import type { Order } from './Order';

export interface PlanDisplayProps<T extends Order = Order> {
    children: (data: {
        plan: T;
        refreshPlan: () => Promise<void>;
    }) => React.ReactNode;
    fallbackNavigationPath?: string;
    getPlan: () => Promise<T>;
}
