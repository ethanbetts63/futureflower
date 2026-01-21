import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const FlowerPlanManagementPage: React.FC = () => {
  return (
    <Card>
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
  );
};

export default FlowerPlanManagementPage;
