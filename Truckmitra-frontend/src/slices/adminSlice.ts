// src/store/slices/adminSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import adminService, { 
  BulkUserIdsRequest, 
  RejectRequest, 
  StatusUpdateRequest, 
  SuspendRequest, 
  User, 
  UserDetailResponse, 
  UserStats 
} from '../services/admin.service';
import toast from 'react-hot-toast';

interface AdminState {
  stats: UserStats | null;
  pendingUsers: User[];        // PENDING_VERIFICATION users
  registeredUsers: User[];      // REGISTERED users (profile incomplete)
  verifiedUsers: User[];        // VERIFIED users
  allUsers: User[];
  selectedUser: UserDetailResponse | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: AdminState = {
  stats: null,
  pendingUsers: [],
  registeredUsers: [],
  verifiedUsers: [],
  allUsers: [],
  selectedUser: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
};

// Async Thunks
export const fetchUserStats = createAsyncThunk(
  'admin/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getUserStats();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, data }: { userId: number; data: StatusUpdateRequest }, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminService.updateUserStatus(userId, data);
      if (response.success) {
        dispatch(fetchUserStats());
        dispatch(fetchAllUsers({}));
        toast.success(`User status updated to ${data.status}`);
        return { userId, message: response.message };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const fetchPendingUsers = createAsyncThunk(
  'admin/fetchPendingUsers',
  async ({ page = 0, size = 20 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await adminService.getPendingUsers(page, size);
      if (response.success) {
        return {
          users: response.data.content,
          totalPages: response.data.totalPages,
          currentPage: response.data.number,
        };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending users');
    }
  }
);

export const fetchRegisteredUsers = createAsyncThunk(
  'admin/fetchRegisteredUsers',
  async ({ page = 0, size = 20 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsersByStatus('REGISTERED', page, size);
      if (response.success) {
        return {
          users: response.data.content,
          totalPages: response.data.totalPages,
          currentPage: response.data.number,
        };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch registered users');
    }
  }
);

export const fetchVerifiedUsers = createAsyncThunk(
  'admin/fetchVerifiedUsers',
  async ({ page = 0, size = 20 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsersByStatus('VERIFIED', page, size);
      if (response.success) {
        return {
          users: response.data.content,
          totalPages: response.data.totalPages,
          currentPage: response.data.number,
        };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch verified users');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (
    params: { status?: string; role?: string; search?: string; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminService.getAllUsers(params);
      if (response.success) {
        return {
          users: response.data.content,
          totalPages: response.data.totalPages,
          currentPage: response.data.number,
        };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'admin/fetchUserDetails',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await adminService.getUserDetails(userId);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

export const verifyUser = createAsyncThunk(
  'admin/verifyUser',
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminService.verifyUser(userId);
      if (response.success) {
        dispatch(fetchUserStats());
        dispatch(fetchPendingUsers({}));
        return { userId, message: response.message };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify user');
    }
  }
);

export const rejectUser = createAsyncThunk(
  'admin/rejectUser',
  async ({ userId, data }: { userId: number; data: RejectRequest }, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminService.rejectUser(userId, data);
      if (response.success) {
        dispatch(fetchUserStats());
        dispatch(fetchPendingUsers({}));
        return { userId, message: response.message };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject user');
    }
  }
);

export const suspendUser = createAsyncThunk(
  'admin/suspendUser',
  async ({ userId, data }: { userId: number; data: SuspendRequest }, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminService.suspendUser(userId, data);
      if (response.success) {
        dispatch(fetchUserStats());
        dispatch(fetchAllUsers({}));
        return { userId, message: response.message };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to suspend user');
    }
  }
);

export const activateUser = createAsyncThunk(
  'admin/activateUser',
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminService.activateUser(userId);
      if (response.success) {
        dispatch(fetchUserStats());
        dispatch(fetchAllUsers({}));
        return { userId, message: response.message };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        dispatch(fetchUserStats());
        dispatch(fetchAllUsers({}));
        return { userId, message: response.message };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const restoreUser = createAsyncThunk(
  'admin/restoreUser',
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminService.restoreUser(userId);
      if (response.success) {
        dispatch(fetchUserStats());
        dispatch(fetchAllUsers({}));
        return { userId, message: response.message };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to restore user');
    }
  }
);

export const bulkVerifyUsers = createAsyncThunk(
  'admin/bulkVerifyUsers',
  async (data: BulkUserIdsRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminService.bulkVerifyUsers(data);
      if (response.success) {
        dispatch(fetchUserStats());
        dispatch(fetchPendingUsers({}));
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to bulk verify users');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setAdminPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Pending Users (PENDING_VERIFICATION)
      .addCase(fetchPendingUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingUsers = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPendingUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Registered Users
      .addCase(fetchRegisteredUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisteredUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.registeredUsers = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchRegisteredUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Verified Users
      .addCase(fetchVerifiedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVerifiedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.verifiedUsers = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchVerifiedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
 .addCase(updateUserStatus.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateUserStatus.fulfilled, (state) => {
    state.loading = false;
    state.selectedUser = null;
  })
  .addCase(updateUserStatus.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  })
      // Verify User
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.loading = false;
        state.selectedUser = null;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reject User
      .addCase(rejectUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectUser.fulfilled, (state) => {
        state.loading = false;
        state.selectedUser = null;
      })
      .addCase(rejectUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Suspend User
      .addCase(suspendUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(suspendUser.fulfilled, (state) => {
        state.loading = false;
        state.selectedUser = null;
      })
      .addCase(suspendUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Activate User
      .addCase(activateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateUser.fulfilled, (state) => {
        state.loading = false;
        state.selectedUser = null;
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.selectedUser = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Restore User
      .addCase(restoreUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreUser.fulfilled, (state) => {
        state.loading = false;
        state.selectedUser = null;
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Bulk Verify Users
      .addCase(bulkVerifyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkVerifyUsers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bulkVerifyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminError, clearSelectedUser, setAdminPage } = adminSlice.actions;
export default adminSlice.reducer;