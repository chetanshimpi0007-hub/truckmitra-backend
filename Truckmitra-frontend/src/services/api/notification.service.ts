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
  getAll: () => protectedApi.get<{ data: Notification[] }>('/notifications'),
  getUnread: () => protectedApi.get<{ data: Notification[] }>('/notifications/unread'),
  getUnreadCount: () => protectedApi.get<{ data: number }>('/notifications/unread/count'),
  markAsRead: (id: number) => protectedApi.patch(`/notifications/${id}/read`),
  markAllAsRead: () => protectedApi.patch('/notifications/read-all'),
  delete: (id: number) => protectedApi.delete(`/notifications/${id}`),
};
