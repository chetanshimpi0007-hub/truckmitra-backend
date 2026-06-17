import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService, Notification } from '../services/api/notification.service';

export const useNotifications = (pollIntervalMs = 30000) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const fetchNotifications = useCallback(async () => {
    // Only fetch if token exists
    if (!localStorage.getItem('accessToken') && !localStorage.getItem('token')) {
      return;
    }
    
    try {
      const res = await notificationService.getAll();
      const data: Notification[] = res.data?.data || res.data || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch {
      // silent - don't break app if notifications endpoint isn't ready
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, pollIntervalMs);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current as any); };
  }, [fetchNotifications, pollIntervalMs]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  }, []);

  return { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead };
};
