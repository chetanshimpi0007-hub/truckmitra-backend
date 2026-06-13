import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HiBell, HiCheckCircle, HiXCircle, HiExclamationCircle,
  HiInformationCircle, HiTruck, HiCheck, HiX
} from 'react-icons/hi';
import { useAuth } from '../../hooks/auth.hook';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  readStatus?: boolean;
  isRead?: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<string, { icon: React.ReactNode; color: string }> = {
  SUCCESS: { icon: <HiCheckCircle />,       color: 'text-emerald-500' },
  ERROR:   { icon: <HiXCircle />,           color: 'text-rose-500' },
  WARNING: { icon: <HiExclamationCircle />, color: 'text-amber-500' },
  TRIP:    { icon: <HiTruck />,             color: 'text-blue-500' },
  BID:     { icon: <HiCheckCircle />,       color: 'text-purple-500' },
  RECEIPT: { icon: <HiInformationCircle />, color: 'text-indigo-500' },
  INFO:    { icon: <HiInformationCircle />, color: 'text-slate-400' },
};

const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<any>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      // Try new endpoint first
      const res = await protectedApi.get('/api/notifications');
      const data: Notification[] = res.data?.data || res.data || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead && !n.readStatus).length);
    } catch {
      try {
        // Fallback to legacy endpoint
        const res = await protectedApi.get(`/api/notifications/legacy/user/${user.id}`);
        const data: Notification[] = res.data || [];
        setNotifications(data);
        const countRes = await protectedApi.get(`/api/notifications/legacy/user/${user.id}/unread-count`);
        setUnreadCount(countRes.data || 0);
      } catch { /* silent — notifications are non-critical */ }
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await protectedApi.patch(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, readStatus: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  };

  const markAllAsRead = async () => {
    try {
      await protectedApi.patch('/api/notifications/read-all');
    } catch {
      try {
        const unread = notifications.filter(n => !n.isRead && !n.readStatus);
        await Promise.all(unread.map(n => protectedApi.patch(`/api/notifications/legacy/${n.id}/read`)));
      } catch { /* silent */ }
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readStatus: true })));
    setUnreadCount(0);
  };

  const toggleDropdown = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (opening) fetchNotifications();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all text-slate-500 shadow-sm border border-slate-200 hover:border-slate-300 hover:scale-105"
        title="Notifications"
      >
        <HiBell className={`w-6 h-6 ${unreadCount > 0 ? 'animate-wiggle' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-rose-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-black px-1 animate-bounce shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-[24px] shadow-2xl border border-slate-200 z-[50] overflow-hidden"
          style={{ animation: 'slideDown 0.2s ease-out' }}>
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-black text-slate-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead}
                  className="text-[11px] font-black text-emerald-600 hover:underline flex items-center space-x-1">
                  <HiCheck className="w-3 h-3" /><span>All read</span>
                </button>
              )}
              <button onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <HiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-16 text-center">
                <HiBell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-sm">No notifications yet.</p>
                <p className="text-slate-300 text-xs mt-1">We'll notify you of important updates.</p>
              </div>
            ) : (
              notifications.slice(0, 50).map(n => {
                const isRead = n.isRead || n.readStatus;
                const typeKey = (n.type || 'INFO').toUpperCase();
                const cfg = TYPE_ICON[typeKey] || TYPE_ICON.INFO;
                return (
                  <button
                    key={n.id}
                    onClick={() => !isRead && markAsRead(n.id)}
                    className={`w-full text-left px-5 py-4 flex items-start space-x-4 transition-all hover:bg-slate-50 ${
                      isRead ? 'opacity-60' : 'bg-white'
                    }`}
                  >
                    <div className={`text-xl flex-shrink-0 mt-0.5 ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm truncate ${!isRead ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>
                          {n.title}
                        </p>
                        {!isRead && (
                          <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-300 font-bold mt-1.5">
                        {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                {notifications.length} total notifications
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
