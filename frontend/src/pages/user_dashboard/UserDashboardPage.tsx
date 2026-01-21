import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const UserDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Manage your account and flower plans.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Link to="/dashboard/account">
            <Button className="w-full">Account Management</Button>
          </Link>
          <Link to="/dashboard/plans">
            <Button className="w-full">Flower Plan Management</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboardPage;
