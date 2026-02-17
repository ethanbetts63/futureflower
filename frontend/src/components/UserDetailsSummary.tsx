import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Link } from 'react-router-dom';
import type { UserDetailsSummaryProps } from '../types/UserDetailsSummaryProps';

const UserDetailsSummary: React.FC<UserDetailsSummaryProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center py-6">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-black/5 text-lg font-semibold text-black/60">
          {getInitials(user.first_name, user.last_name)}
        </div>
        <div>
          <p className="text-lg font-semibold text-black">{`${user.first_name} ${user.last_name}`}</p>
          <p className="text-sm text-black/40">{user.email}</p>
        </div>
      </div>
      <Link
        to="/dashboard/account"
        className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
      >
        Edit
      </Link>
    </div>
  );
};

export default UserDetailsSummary;
