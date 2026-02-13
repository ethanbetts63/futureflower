import React, { useState, useEffect, useMemo } from 'react';
import { getUpfrontPlans, getUserProfile } from '@/api';
import { type UserProfile } from '@/types/UserProfile';
import { type UpfrontPlan } from '@/types/UpfrontPlan';
import { type DeliveryEvent } from '@/types/DeliveryEvent';

import NextDeliveryCard from '@/components/NextDeliveryCard';
import type { NextDeliveryInfo } from '../../types/NextDeliveryInfo';
import UnifiedPlanTable from '@/components/UnifiedPlanTable';
import UserDetailsSummary from '@/components/UserDetailsSummary';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
    <div className="w-full text-black">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
      <p className="mb-8 text-lg">
        This is your central hub for managing everything related to your Forever Flower account. 
        Here you can get a quick overview of your flower plans, upcoming deliveries, and account details.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center col-span-1 md:col-span-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading your summary...</p>
          </div>
        ) : (
          <>
            <UserDetailsSummary user={user} />
            <NextDeliveryCard deliveryInfo={nextDelivery} />
            <div className="col-span-1 md:col-span-2">
                <UnifiedPlanTable showTitle={false} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
