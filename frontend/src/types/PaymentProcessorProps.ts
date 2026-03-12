import type { ReactNode } from 'react';
import type { Plan } from './Plan';

export interface PaymentProcessorProps {
    getPlan: (planId: string) => Promise<Plan>;
    createPayment: (payload: any) => Promise<{ clientSecret: string }>;
    SummaryComponent: (props: { plan: Plan; newPlanDetails?: any }) => ReactNode;
    planType: 'upfront' | 'subscription';
    mode: 'booking' | 'management';
}
