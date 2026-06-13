import React from 'react';
import { HiBell, HiCheck, HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiTruck, HiXCircle } from 'react-icons/hi';
import { Notification } from '../../services/api/notification.service';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  SUCCESS: { icon: <HiCheckCircle />, color: 'text-emerald-500' },
  ERROR:   { icon: <HiXCircle />,     color: 'text-rose-500' },
  WARNING: { icon: <HiExclamationCircle />, color: 'text-amber-500' },
  TRIP:    { icon: <HiTruck />,       color: 'text-blue-500' },
  BID:     { icon: <HiCheckCircle />, color: 'text-purple-500' },
  RECEIPT: { icon: <HiInformationCircle />, color: 'text-indigo-500' },
  INFO:    { icon: <HiInformationCircle />, color: 'text-slate-400' },
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications, onMarkAsRead, onMarkAllAsRead, onClose
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-96 bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <HiBell className="w-6 h-6 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <h3 className="font-black text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] font-black text-emerald-600 hover:underline flex items-center space-x-1"
          >
            <HiCheck className="w-3 h-3" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <HiBell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-sm">No notifications yet.</p>
          </div>
        ) : (
          notifications.map(n => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.INFO;
            return (
              <button
                key={n.id}
                onClick={() => !n.isRead && onMarkAsRead(n.id)}
                className={`w-full text-left px-6 py-4 flex items-start space-x-4 transition-all hover:bg-slate-50/80 ${
                  n.isRead ? 'opacity-60' : 'bg-white'
                }`}
              >
                <div className={`text-xl flex-shrink-0 mt-0.5 ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className={`text-sm font-black text-slate-900 truncate ${
                      !n.isRead ? '' : 'font-medium'
                    }`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-slate-300 font-bold mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {notifications.length} total notifications
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
