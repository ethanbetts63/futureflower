import type { Plan } from './Plan';

export interface PaymentProcessorProps {
    getPlan: (planId: string) => Promise<Plan>;
    createPayment: (payload: any) => Promise<{ clientSecret: string }>;
    SummaryComponent: React.FC<{ plan: Plan; newPlanDetails?: any }>;
    planType: 'upfront' | 'subscription';
    mode: 'booking' | 'management';
}
