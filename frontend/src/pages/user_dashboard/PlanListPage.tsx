import React from 'react';
import UnifiedPlanTable from '@/components/UnifiedPlanTable';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import Seo from '@/components/Seo';

const UpfrontPlanListPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-0 md:px-4 max-w-4xl">
        <Seo title="Your Flower Plans | FutureFlower" />
        <UnifiedSummaryCard 
          title="Your Flower Plans" 
          description="Review and manage your scheduled flower deliveries and subscriptions."
        >
          <div className="py-4">
            <UnifiedPlanTable />
          </div>
        </UnifiedSummaryCard>
      </div>
    </div>
  );
};

export default UpfrontPlanListPage;