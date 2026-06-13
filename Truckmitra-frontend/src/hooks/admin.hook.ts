// src/hooks/admin.hook.ts
import { useAppSelector, useAppDispatch } from './redux.hook';
import {
  fetchUserStats,
  fetchPendingUsers,
  fetchRegisteredUsers,
  fetchVerifiedUsers,
  fetchAllUsers,
  fetchUserDetails,
  verifyUser,
  rejectUser,
  suspendUser,
  activateUser,
  deleteUser,
  restoreUser,
  bulkVerifyUsers,
  clearAdminError,
  clearSelectedUser,
  setAdminPage,
} from '../slices/adminSlice';
import { useCallback, useEffect } from 'react';
import { RejectRequest, SuspendRequest, BulkUserIdsRequest, StatusUpdateRequest } from '../services/admin.service';
import toast from 'react-hot-toast';
import { updateUserStatus as updateUserStatusAction } from '../slices/adminSlice';

export const useAdmin = () => {
  const dispatch = useAppDispatch();
  const { 
    stats, 
    pendingUsers, 
    registeredUsers,
    verifiedUsers,
    allUsers, 
    selectedUser, 
    loading, 
    error,
    totalPages,
    currentPage 
  } = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  const getStats = useCallback(async () => {
    const result = await dispatch(fetchUserStats());
    if (fetchUserStats.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const getPendingUsers = useCallback(async (page = 0, size = 20) => {
    const result = await dispatch(fetchPendingUsers({ page, size }));
    if (fetchPendingUsers.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const getRegisteredUsers = useCallback(async (page = 0, size = 20) => {
    const result = await dispatch(fetchRegisteredUsers({ page, size }));
    if (fetchRegisteredUsers.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const getVerifiedUsers = useCallback(async (page = 0, size = 20) => {
    const result = await dispatch(fetchVerifiedUsers({ page, size }));
    if (fetchVerifiedUsers.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const getUsers = useCallback(async (params?: { status?: string; role?: string; search?: string; page?: number; size?: number }) => {
    const result = await dispatch(fetchAllUsers(params || {}));
    if (fetchAllUsers.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const getUserDetails = useCallback(async (userId: number) => {
    const result = await dispatch(fetchUserDetails(userId));
    if (fetchUserDetails.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const handleVerifyUser = useCallback(async (userId: number) => {
    const result = await dispatch(verifyUser(userId));
    if (verifyUser.fulfilled.match(result)) {
      toast.success(result.payload.message || 'User verified successfully');
      return true;
    }
    return false;
  }, [dispatch]);

  const handleRejectUser = useCallback(async (userId: number, data: RejectRequest) => {
    const result = await dispatch(rejectUser({ userId, data }));
    if (rejectUser.fulfilled.match(result)) {
      toast.success(result.payload.message || 'User rejected successfully');
      return true;
    }
    return false;
  }, [dispatch]);

  const handleSuspendUser = useCallback(async (userId: number, data: SuspendRequest) => {
    const result = await dispatch(suspendUser({ userId, data }));
    if (suspendUser.fulfilled.match(result)) {
      toast.success(result.payload.message || 'User suspended successfully');
      return true;
    }
    return false;
  }, [dispatch]);

  const handleActivateUser = useCallback(async (userId: number) => {
    const result = await dispatch(activateUser(userId));
    if (activateUser.fulfilled.match(result)) {
      toast.success(result.payload.message || 'User activated successfully');
      return true;
    }
    return false;
  }, [dispatch]);

  const handleDeleteUser = useCallback(async (userId: number) => {
    const result = await dispatch(deleteUser(userId));
    if (deleteUser.fulfilled.match(result)) {
      toast.success(result.payload.message || 'User deleted successfully');
      return true;
    }
    return false;
  }, [dispatch]);

  const handleRestoreUser = useCallback(async (userId: number) => {
    const result = await dispatch(restoreUser(userId));
    if (restoreUser.fulfilled.match(result)) {
      toast.success(result.payload.message || 'User restored successfully');
      return true;
    }
    return false;
  }, [dispatch]);

  const handleBulkVerify = useCallback(async (data: BulkUserIdsRequest) => {
    const result = await dispatch(bulkVerifyUsers(data));
    if (bulkVerifyUsers.fulfilled.match(result)) {
      toast.success(`Bulk verify completed: ${result.payload.successCount} succeeded, ${result.payload.failCount} failed`);
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedUser());
  }, [dispatch]);

  const setPage = useCallback((page: number) => {
    dispatch(setAdminPage(page));
  }, [dispatch]);

  const handleUpdateUserStatus = useCallback(
    async (userId: number, data: StatusUpdateRequest) => {
      const result = await dispatch(updateUserStatusAction({ userId, data }));
      if (updateUserStatusAction.fulfilled.match(result)) {
        toast.success(result.payload.message || 'User status updated successfully');
        return true;
      }
      return false;
    },
    [dispatch]
  );

  return {
    // State
    stats,
    pendingUsers,
    registeredUsers,
    verifiedUsers,
    allUsers,
    selectedUser,
    loading,
    totalPages,
    currentPage,
      updateUserStatus: handleUpdateUserStatus,  // ✅ Add this

    // Actions
    getStats,
    getPendingUsers,
    getRegisteredUsers,
    getVerifiedUsers,
    getUsers,
    getUserDetails,
    verifyUser: handleVerifyUser,
    rejectUser: handleRejectUser,
    suspendUser: handleSuspendUser,
    activateUser: handleActivateUser,
    deleteUser: handleDeleteUser,
    restoreUser: handleRestoreUser,
    bulkVerifyUsers: handleBulkVerify,
    clearSelectedUser: clearSelected,
    setPage,
  };
};