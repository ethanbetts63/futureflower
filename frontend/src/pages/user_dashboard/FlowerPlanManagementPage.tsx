import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const FlowerPlanManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-white shadow-md border-none text-black">
          <CardHeader>
            <CardTitle>Flower Plan Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is where you will manage your existing flower plans.</p>
            <p className="mt-4 text-sm text-muted-foreground">
              (This feature is coming soon.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlowerPlanManagementPage;
