import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
export const GlobalNotification: React.FC = () => {
  useNotifications();
  return null;
};
