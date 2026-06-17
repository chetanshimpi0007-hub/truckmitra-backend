// src/services/admin.service.ts
import { API_ENDPOINTS } from '../routes/routes';
import { protectedApi } from './api/protectedAndPublicAPI';

export interface UserStats {
  pending: number;      // PENDING_VERIFICATION
  approved: number;     // VERIFIED
  rejected: number;     // REJECTED
  suspended: number;    // SUSPENDED
  deleted: number;      // DELETED
  registered: number;   // REGISTERED (new)
  total: number;
}

export interface User {
  id: number;
  fullName: string;
  mobile: string;
  email: string;
  role: string;
  accountStatus: string;  // Will be: REGISTERED, PENDING_VERIFICATION, VERIFIED, etc.
  registeredAt: string;
  lastLoginAt?: string;
  verifiedBy?: number;
  verifiedAt?: string;
  profileImageUrl?: string;
  isActive?: boolean;
  isProfileCompleted?: boolean;  // New field
  statusMessage?: string;        // New field
}

export interface UserDetailResponse extends User {
  profileDetails?: Record<string, any>;
}

export interface RejectRequest {
  reason: string;
}

export interface SuspendRequest {
  reason: string;
}

export interface StatusUpdateRequest {
  status: string;
  reason?: string;
}

export interface BulkUserIdsRequest {
  userIds: number[];
}

export interface BulkOperationResponse {
  successCount: number;
  failCount: number;
}
// src/services/admin.service.ts

export interface StatusUpdateRequest {
  status: string;
  reason?: string;
}


class AdminService {
  // ==================== GET OPERATIONS ====================

  /**
   * Get pending users for approval (PENDING_VERIFICATION)
   */
  async getPendingUsers(page = 0, size = 20) {
    const response = await protectedApi.get(`${API_ENDPOINTS.ADMIN.PENDING_USERS}?page=${page}&size=${size}`);
    return response.data;
  }

  /**
   * Get user statistics counts - using the correct endpoint
   */
  async getUserStats() {
    // Use the dashboard stats endpoint that returns all counts
    const response = await protectedApi.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
    return response.data;
  }

  /**
   * Get users by status
   */
  async getUsersByStatus(status: string, page = 0, size = 20) {
    const response = await protectedApi.get(`/api/admin/users/status/${status}?page=${page}&size=${size}`);
    return response.data;
  }

  /**
   * Get user details by ID
   */
  async getUserDetails(userId: number) {
    const response = await protectedApi.get(`/api/admin/users/${userId}`);
    return response.data;
  }

  /**
   * Get user financial snapshot by ID
   */
  async getUserFinancialSnapshot(userId: number) {
    const response = await protectedApi.get(`/api/admin/users/${userId}/snapshot`);
    return response.data;
  }

  /**
   * Get user trips by ID with pagination
   */
  async getUserTrips(userId: number, page = 0, size = 10) {
    const response = await protectedApi.get(`/api/admin/users/${userId}/trips?page=${page}&size=${size}`);
    return response.data;
  }

  /**
   * Get user payments by ID with pagination
   */
  async getUserPayments(userId: number, page = 0, size = 10) {
    const response = await protectedApi.get(`/api/admin/users/${userId}/payments?page=${page}&size=${size}`);
    return response.data;
  }

  /**
   * Get user timeline by ID with pagination
   */
  async getUserTimeline(userId: number, page = 0, size = 10) {
    const response = await protectedApi.get(`/api/admin/users/${userId}/timeline?page=${page}&size=${size}`);
    return response.data;
  }

  /**
   * Get user invoices by ID with pagination
   */
  async getUserInvoices(userId: number, page = 0, size = 10) {
    const response = await protectedApi.get(`/api/admin/users/${userId}/invoices?page=${page}&size=${size}`);
    return response.data;
  }

  /**
   * Get all users with filters
   */
  async getAllUsers(params?: {
    status?: string;
    role?: string;
    search?: string;
    page?: number;
    size?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const url = `${API_ENDPOINTS.ADMIN.USERS}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await protectedApi.get(url);
    return response.data;
  }

  // ==================== STATUS UPDATE OPERATIONS ====================

  /**
   * Verify a user (PENDING_VERIFICATION → VERIFIED)
   */
  async verifyUser(userId: number) {
    const response = await protectedApi.put(`/api/admin/users/${userId}/approve`);
    return response.data;
  }

  /**
   * Reject a user (PENDING_VERIFICATION → REJECTED)
   */
  async rejectUser(userId: number, data: RejectRequest) {
    const response = await protectedApi.put(`/api/admin/users/${userId}/reject`, data);
    return response.data;
  }

  /**
   * Suspend a user (VERIFIED → SUSPENDED)
   */
  async suspendUser(userId: number, data: SuspendRequest) {
    const response = await protectedApi.put(`/api/admin/users/${userId}/suspend`, data);
    return response.data;
  }

  /**
   * Activate a suspended user (SUSPENDED → VERIFIED)
   */
  async activateUser(userId: number) {
    const response = await protectedApi.put(`/api/admin/users/${userId}/activate`);
    return response.data;
  }

  /**
   * Delete a user (soft delete) (any status → DELETED)
   */
  async deleteUser(userId: number) {
    const response = await protectedApi.delete(`/api/admin/users/${userId}`);
    return response.data;
  }

  /**
   * Restore a deleted user (DELETED → PENDING_VERIFICATION)
   */
  async restoreUser(userId: number) {
    const response = await protectedApi.put(`/api/admin/users/${userId}/restore`);
    return response.data;
  }

  /**
   * Update user status (generic method)
   */
  // async updateUserStatus(userId: number, data: StatusUpdateRequest) {
  //   const response = await protectedApi.put(`/api/admin/users/${userId}/status`, data);
  //   return response.data;
  // }

// Add to AdminService class
async updateUserStatus(userId: number, data: StatusUpdateRequest) {
  const response = await protectedApi.put(`/api/admin/users/${userId}/status`, data);
  return response.data;
}
  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk verify multiple users
   */
  async bulkVerifyUsers(data: BulkUserIdsRequest) {
    const response = await protectedApi.put('/api/admin/users/bulk/verify', data);
    return response.data;
  }
}

// Create and export a single instance
const adminService = new AdminService();
export default adminService;