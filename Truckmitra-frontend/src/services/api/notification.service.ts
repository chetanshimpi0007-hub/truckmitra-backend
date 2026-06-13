import { protectedApi } from './protectedAndPublicAPI';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'TRIP' | 'BID' | 'RECEIPT';
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
}

export const notificationService = {
  getAll: () => protectedApi.get<{ data: Notification[] }>('/api/notifications'),
  getUnread: () => protectedApi.get<{ data: Notification[] }>('/api/notifications/unread'),
  getUnreadCount: () => protectedApi.get<{ data: number }>('/api/notifications/unread/count'),
  markAsRead: (id: number) => protectedApi.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => protectedApi.patch('/api/notifications/read-all'),
  delete: (id: number) => protectedApi.delete(`/api/notifications/${id}`),
};
