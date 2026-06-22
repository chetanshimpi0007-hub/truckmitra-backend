import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api';
const WS_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'LOAD' | 'BID' | 'TRIP' | 'WALLET' | 'SYSTEM' | 'SUBSCRIPTION';
  isRead: boolean;
  relatedId: number | null;
  createdAt: string;
}

interface UseNotificationsResult {
  notifications: NotificationItem[];
  unreadCount: number;
  isConnected: boolean;
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  hasMore: boolean;
}

export function useNotifications(userId: number | null, token: string | null): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const clientRef = useRef<Client | null>(null);

  const fetchNotifications = useCallback(async (pageNum = 0) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications?page=${pageNum}&size=20&sort=createdAt,desc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const content: NotificationItem[] = data.content ?? [];
      if (pageNum === 0) {
        setNotifications(content);
      } else {
        setNotifications(prev => [...prev, ...content]);
      }
      setHasMore(!data.last);
    } catch { /* ignore */ }
  }, [token]);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.count ?? 0);
    } catch { /* ignore */ }
  }, [token]);

  const markAsRead = useCallback(async (id: number) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/notifications/read/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  }, [token]);

  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  }, [token]);

  const deleteNotification = useCallback(async (id: number) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => {
        const target = prev.find(x => x.id === id);
        if (target && !target.isRead) setUnreadCount(c => Math.max(0, c - 1));
        return prev.filter(x => x.id !== id);
      });
    } catch { /* ignore */ }
  }, [token]);

  // STOMP WebSocket connection
  useEffect(() => {
    if (!userId || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/user/${userId}/queue/notifications`, (msg: IMessage) => {
          try {
            const incoming: NotificationItem = JSON.parse(msg.body);
            setNotifications(prev => [incoming, ...prev]);
            setUnreadCount(prev => prev + 1);
          } catch { /* ignore */ }
        });
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: () => setIsConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [userId, token]);

  // Initial REST fetch
  useEffect(() => {
    if (userId && token) {
      fetchNotifications(0);
      fetchUnreadCount();
    }
  }, [userId, token, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isConnected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    hasMore,
  };
}
