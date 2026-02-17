
import React, { useState, useEffect, useMemo } from 'react';
import { getUpfrontPlans, getUserProfile } from '@/api';
import { type UserProfile } from '@/types/UserProfile';
import { type UpfrontPlan } from '@/types/UpfrontPlan';
import { type DeliveryEvent } from '@/types/DeliveryEvent';

import NextDeliveryCard from '@/components/NextDeliveryCard';
import type { NextDeliveryInfo } from '../../types/NextDeliveryInfo';
import UnifiedPlanTable from '@/components/UnifiedPlanTable';
import UserDetailsSummary from '@/components/UserDetailsSummary';
import SummarySection from '@/components/form_flow/SummarySection';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Seo from '@/components/Seo';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';

const UserDashboardPage: React.FC = () => {
  const [plans, setPlans] = useState<UpfrontPlan[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, userData] = await Promise.all([
          getUpfrontPlans(),
          getUserProfile(),
        ]);
        setPlans(plansData);
        setUser(userData);
      } catch (err: any) {
        toast.error("Failed to load your dashboard.", { description: err.message });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextDelivery = useMemo((): NextDeliveryInfo | null => {
    const upcomingDeliveries: NextDeliveryInfo[] = [];
    const now = new Date();

    plans.forEach((plan: UpfrontPlan) => {
      if (plan.events && plan.events.length > 0) {
        const sortedEvents = [...plan.events].sort((a: DeliveryEvent, b: DeliveryEvent) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime());
        
        plan.events
          .filter((event: DeliveryEvent) => new Date(event.delivery_date) >= now)
          .forEach((event: DeliveryEvent) => {
            const deliveryIndex = sortedEvents.findIndex(e => e.id === event.id);
            upcomingDeliveries.push({
              plan,
              event: event as DeliveryEvent,
              deliveryIndex: deliveryIndex + 1,
            });
          });
      }
    });

    if (upcomingDeliveries.length === 0) {
      return null;
    }

    upcomingDeliveries.sort((a: NextDeliveryInfo, b: NextDeliveryInfo) => new Date(a.event.delivery_date).getTime() - new Date(b.event.delivery_date).getTime());

    return upcomingDeliveries[0];
  }, [plans]);

  return (
    <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
      <div className="container mx-auto max-w-4xl">
        <Seo title="Dashboard | FutureFlower" />
        
        <UnifiedSummaryCard
          title="Welcome to Your Dashboard"
          description="Your central hub for managing your Forever Flower account."
        >
          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-black/20" />
              <p className="ml-4 text-black/40">Loading your summary...</p>
            </div>
          ) : (
            <>
              <SummarySection label="Account Details">
                <UserDetailsSummary user={user} />
              </SummarySection>

              <SummarySection label="Your Next Delivery">
                <NextDeliveryCard deliveryInfo={nextDelivery} />
              </SummarySection>

              <SummarySection label="Your Flower Plans">
                <UnifiedPlanTable />
              </SummarySection>
            </>
          )}
        </UnifiedSummaryCard>
      </div>
    </div>
  );
};

export default UserDashboardPage;
