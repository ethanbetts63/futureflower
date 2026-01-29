import type { ButtonProps } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '@/components/ui/button';
import type { UpfrontPlan, SubscriptionPlan, Payment, PartialUpfrontPlan } from '@/types';


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