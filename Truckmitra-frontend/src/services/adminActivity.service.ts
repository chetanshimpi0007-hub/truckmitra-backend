import { protectedApi } from './api/protectedAndPublicAPI';

export interface AdminActivityStats {
  totalLoads: number;
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  pendingPod: number;
  availableDrivers: number;
  driversOnTrip: number;
  approvedUsers: number;
  pendingUsers: number;
}

export interface AuditLog {
  id: number;
  userId: number;
  module: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class AdminActivityService {
  async getDashboardStats(): Promise<AdminActivityStats> {
    const response = await protectedApi.get('/api/admin/activity/dashboard-stats');
    return response.data;
  }

  async getTimeline(limit = 50): Promise<AuditLog[]> {
    const response = await protectedApi.get('/api/admin/activity/timeline', { params: { limit } });
    return response.data;
  }

  async getTripsMaster(search = '', page = 0, size = 20): Promise<PageResponse<any>> {
    const response = await protectedApi.get('/api/admin/activity/trips-master', {
      params: { search, page, size }
    });
    return response.data;
  }
}

const adminActivityService = new AdminActivityService();
export default adminActivityService;
