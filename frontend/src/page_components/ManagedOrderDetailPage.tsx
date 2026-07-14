"use client";

import PlanDisplay from '@/components/PlanDisplay';
import OrderSummary from '@/components/OrderSummary';
import { getOrder } from '@/api/orders';
import type { FlowerType, Order } from '@/types';

export default function ManagedOrderDetailPage({ orderId }: { orderId: string }) {
  return (
    <main className="min-h-screen bg-[var(--color4)] py-10">
      <div className="mx-auto max-w-4xl px-4">
        <PlanDisplay getPlan={getOrder} fallbackNavigationPath="/manage-order">
          {({ plan, flowerTypeMap, refreshPlan }: { plan: Order; flowerTypeMap: Map<number, FlowerType>; refreshPlan: () => Promise<void> }) => (
            <OrderSummary plan={plan} flowerTypeMap={flowerTypeMap} context="management" planId={orderId} onRefreshPlan={refreshPlan} />
          )}
        </PlanDisplay>
      </div>
    </main>
  );
}
