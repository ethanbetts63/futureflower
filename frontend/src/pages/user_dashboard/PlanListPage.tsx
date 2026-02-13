import React from 'react';
import UnifiedPlanTable from '@/components/UnifiedPlanTable';

const UpfrontPlanListPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        <UnifiedPlanTable showTitle={true} />
      </div>
    </div>
  );
};

export default UpfrontPlanListPage;