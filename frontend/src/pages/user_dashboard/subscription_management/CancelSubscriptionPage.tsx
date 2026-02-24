import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import PlanDisplay from '@/components/PlanDisplay';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { getSubscriptionPlan, cancelSubscription } from '@/api/subscriptionPlans';
import { formatDate } from '@/utils/utils';
import type { SubscriptionPlan } from '@/types/SubscriptionPlan';
import type { FlowerType } from '@/types/FlowerType';
import type { Plan } from '@/types/Plan';

const isSubscriptionPlan = (plan: Plan): plan is SubscriptionPlan =>
  'stripe_subscription_id' in plan;

const CancelSubscriptionPageInner: React.FC<{ plan: SubscriptionPlan; planId: string }> = ({
  plan,
  planId,
}) => {
  const navigate = useNavigate();
  const [cancelType, setCancelType] = useState<'keep_current' | 'cancel_all'>('keep_current');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await cancelSubscription(planId, cancelType);
      setDialogOpen(false);
      toast.success('Your subscription has been cancelled.');
      navigate('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UnifiedSummaryCard
      title="Cancel Subscription"
      description="Choose how you would like to cancel your subscription."
      footer={
        <div className="flex justify-start items-center w-full">
          <FlowBackButton to={`/dashboard/subscription-plans/${planId}/overview`} />
        </div>
      }
    >
      <div className="py-6 space-y-6">
        {/* Plan summary */}
        <div className="bg-black/5 rounded-2xl p-5 space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase text-black/40">Plan Summary</p>
          <p className="font-semibold">
            {plan.recipient_first_name
              ? `For ${plan.recipient_first_name} ${plan.recipient_last_name ?? ''}`.trim()
              : 'Unnamed recipient'}
          </p>
          <p className="text-sm text-black/60 capitalize">{plan.frequency} delivery</p>
          {plan.start_date && (
            <p className="text-sm text-black/60">
              Next delivery: {formatDate(plan.start_date)}
            </p>
          )}
        </div>

        {/* Cancel options */}
        <RadioGroup
          value={cancelType}
          onValueChange={(v) => setCancelType(v as 'keep_current' | 'cancel_all')}
          className="space-y-3"
        >
          <label
            htmlFor="keep_current"
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-colors ${
              cancelType === 'keep_current'
                ? 'border-black bg-black/5'
                : 'border-black/10 bg-white hover:border-black/20'
            }`}
          >
            <RadioGroupItem value="keep_current" id="keep_current" className="mt-0.5" />
            <div>
              <p className="font-semibold">Keep my next delivery, then cancel</p>
              <p className="text-sm text-black/60 mt-1">
                Your upcoming delivery will still be arranged. No further charges after that.
              </p>
            </div>
          </label>

          <label
            htmlFor="cancel_all"
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-colors ${
              cancelType === 'cancel_all'
                ? 'border-black bg-black/5'
                : 'border-black/10 bg-white hover:border-black/20'
            }`}
          >
            <RadioGroupItem value="cancel_all" id="cancel_all" className="mt-0.5" />
            <div>
              <p className="font-semibold">Cancel immediately</p>
              <p className="text-sm text-black/60 mt-1">
                Cancel everything now, including your next delivery.{' '}
                <span
                  className="underline cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/dashboard/refunds');
                  }}
                >
                  You can request a refund here.
                </span>
              </p>
            </div>
          </label>
        </RadioGroup>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          onClick={() => setDialogOpen(true)}
          className="w-full bg-black text-white hover:bg-black/80 rounded-xl py-3 text-base font-semibold"
        >
          Cancel Subscription
        </Button>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelType === 'keep_current'
                ? 'Your next delivery will proceed as planned, but your subscription will end after that. This cannot be undone.'
                : 'Your subscription and all upcoming deliveries will be cancelled immediately. This cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Go back</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={isSubmitting}
              className="bg-black text-white hover:bg-black/80"
            >
              {isSubmitting ? 'Cancelling...' : 'Yes, cancel subscription'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UnifiedSummaryCard>
  );
};

const CancelSubscriptionPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();

  return (
    <>
      <Seo title="Cancel Subscription | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getSubscriptionPlan} fallbackNavigationPath="/dashboard">
            {({ plan }: { plan: Plan; flowerTypeMap: Map<number, FlowerType> }) => {
              if (!isSubscriptionPlan(plan)) return null;
              return (
                <CancelSubscriptionPageInner plan={plan} planId={planId || ''} />
              );
            }}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default CancelSubscriptionPage;
