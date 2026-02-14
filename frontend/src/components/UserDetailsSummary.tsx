import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import EditButton from '@/components/EditButton';
import type { UserDetailsSummaryProps } from '../types/UserDetailsSummaryProps';

const UserDetailsSummary: React.FC<UserDetailsSummaryProps> = ({ user }) => {
  if (!user) {
    return (
      <Card className="bg-white text-black border-none shadow-md">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <Spinner className="h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="bg-white text-black border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Account Details</CardTitle>
        <EditButton to="/dashboard/account" />
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 text-lg font-semibold text-gray-700">
          {getInitials(user.first_name, user.last_name)}
        </div>
        <div>
          <p className="text-lg font-semibold">{`${user.first_name} ${user.last_name}`}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailsSummary;
