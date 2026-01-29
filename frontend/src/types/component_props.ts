import type { ButtonProps } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '@/components/ui/button';
import type { UpfrontPlan, SubscriptionPlan, Payment, PartialUpfrontPlan, PartialSubscriptionPlan, Color, FlowerType } from '@/types';


export interface BackButtonProps extends ButtonProps {
  to?: string;
}

export interface CreateEventLinkProps extends VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  className?: string;
}

export interface PaymentHistoryCardProps {
  plan: (UpfrontPlan | SubscriptionPlan) & { payments?: Payment[] }; 
}

export interface SeoProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  structuredData?: object;
}

export interface StructureEditorProps {
    mode: 'create' | 'edit';
    title: string;
    description: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    showSkipButton?: boolean; 
}

export interface SubscriptionPlanTableProps {
  showTitle?: boolean;
}

export interface SubscriptionStructureEditorProps {
    mode: 'create' | 'edit';
    title: string;
    description: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
}

export interface BannerProps {
  children: React.ReactNode;
  variant?: 'warning' | 'info';
}

export interface UpfrontPlanTableProps {
  showTitle?: boolean; // Optional prop to show/hide the title within the component
  initialPlans?: UpfrontPlan[]; // Optional prop to provide initial plans, if not fetching internally
}

export interface UpfrontPlanSummaryProps {
  plan: UpfrontPlan;
  newPlanDetails?: PartialUpfrontPlan & { amount: number };
}

export interface SubscriptionStructureCardProps {
    plan: SubscriptionPlan;
    editUrl: string;
}

export interface SubscriptionPlanSummaryProps {
  plan: UpfrontPlan | SubscriptionPlan;
  newPlanDetails?: any;
}

export interface SelectableTagProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export interface RecipientEditorProps {
    mode: 'create' | 'edit';
    title: string;
    saveButtonText: string;
    onSaveNavigateTo: string; // A string pattern like '/dashboard/plans/{planId}/overview'
    onCancelNavigateTo: string; // A string pattern like '/dashboard' or '/dashboard/plans/{planId}/overview'
    getPlan: (planId: string) => Promise<UpfrontPlan | SubscriptionPlan>;
    updatePlan: (planId: string, data: PartialUpfrontPlan | PartialSubscriptionPlan) => Promise<UpfrontPlan | SubscriptionPlan>;
}

export interface RecipientCardProps {
    plan: UpfrontPlan | SubscriptionPlan;
    editUrl: string;
}

export interface PreferencesEditorProps {
    mode: 'create' | 'edit';
    title: string;
    description: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    showSkipButton: boolean;
    getPlan: (planId: string) => Promise<UpfrontPlan | SubscriptionPlan>;
    updatePlan: (planId: string, data: PartialUpfrontPlan | PartialSubscriptionPlan) => Promise<UpfrontPlan | SubscriptionPlan>;
}

type Plan = UpfrontPlan | SubscriptionPlan;

export interface PlanDisplayProps {
    children: (data: {
        plan: Plan;
        colorMap: Map<number, Color>;
        flowerTypeMap: Map<number, FlowerType>;
    }) => React.ReactNode;
    fallbackNavigationPath?: string;
    getPlan: (planId: string) => Promise<Plan>;
}

export interface PlanStructureCardProps {
    plan: UpfrontPlan;
    editUrl: string;
}

export interface PlanActivationBannerProps {
  planId: string;
}

export interface PaymentProcessorProps {
    getPlan: (planId: string) => Promise<Plan>;
    createPayment: (payload: any) => Promise<{ clientSecret: string }>;
    SummaryComponent: React.FC<{ plan: Plan; newPlanDetails?: any }>;
    planType: 'upfront' | 'subscription';
    mode: 'booking' | 'management';
}