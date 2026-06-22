import React from 'react';
import { usePushNotifications } from '../../hooks/usePushNotifications';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({ isOpen, onClose }) => {
  const { permission, requestPermission } = usePushNotifications();

  if (!isOpen || permission === 'granted' || permission === 'denied') return null;

  const handleAllow = async () => {
    await requestPermission();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold mb-2">Enable Notifications</h3>
        <p className="text-gray-600 mb-6">
          Get real-time updates on your trips, truck statuses, and important alerts.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
          >
            Later
          </button>
          <button
            onClick={handleAllow}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionModal;
