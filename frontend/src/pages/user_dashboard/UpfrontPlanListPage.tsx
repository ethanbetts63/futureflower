import React from 'react';
import UpfrontPlanTable from '@/components/UpfrontPlanTable';
import SubscriptionPlanTable from '@/components/SubscriptionPlanTable';

const UpfrontPlanListPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        <UpfrontPlanTable showTitle={true} />
        <SubscriptionPlanTable showTitle={true} />
      </div>
    </div>
  );
};

export default UpfrontPlanListPage;