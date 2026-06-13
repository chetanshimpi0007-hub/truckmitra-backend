// src/components/common/StatusBadge.tsx
import React from 'react';
import { AccountStatus } from '../../interfaces/auth.interface';

interface StatusBadgeProps {
  status: AccountStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case AccountStatus.VERIFIED:
        return 'bg-green-100 text-green-800';
      case AccountStatus.REGISTERED:
        return 'bg-blue-100 text-blue-800';
      case AccountStatus.PENDING_VERIFICATION:
        return 'bg-yellow-100 text-yellow-800';
      case AccountStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case AccountStatus.SUSPENDED:
        return 'bg-orange-100 text-orange-800';
      case AccountStatus.DELETED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case AccountStatus.VERIFIED:
        return 'Verified';
      case AccountStatus.REGISTERED:
        return 'Registered';
      case AccountStatus.PENDING_VERIFICATION:
        return 'Pending Verification';
      case AccountStatus.REJECTED:
        return 'Rejected';
      case AccountStatus.SUSPENDED:
        return 'Suspended';
      case AccountStatus.DELETED:
        return 'Deleted';
      default:
        return status;
    }
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles()}`}>
      {getStatusText()}
    </span>
  );
};

export default StatusBadge;