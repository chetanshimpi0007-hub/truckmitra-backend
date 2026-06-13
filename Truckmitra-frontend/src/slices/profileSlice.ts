// src/store/slices/profileSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  DriverProfile,
  TransporterProfile,
  ShipperProfile,
  UserDocument,
  DriverProfileUpdateRequest,
  TransporterProfileUpdateRequest,
  ShipperProfileUpdateRequest,
  DocumentUploadRequest
} from '../interfaces/profile.interface';
import toast from 'react-hot-toast';
import profileService from '../services/profile/profile.service';

interface ProfileState {
  driverProfile: DriverProfile | null;
  transporterProfile: TransporterProfile | null;
  shipperProfile: ShipperProfile | null;
  documents: UserDocument[];
  loading: boolean;
  error: string | null;
  profileComplete: boolean;
}

const initialState: ProfileState = {
  driverProfile: null,
  transporterProfile: null,
  shipperProfile: null,
  documents: [],
  loading: false,
  error: null,
  profileComplete: false
};

// ==================== Async Thunks ====================

// Driver Profile
export const fetchDriverProfile = createAsyncThunk(
  'profile/fetchDriverProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getDriverProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch driver profile');
    }
  }
);

export const updateDriverProfile = createAsyncThunk(
  'profile/updateDriverProfile',
  async (data: DriverProfileUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await profileService.updateDriverProfile(data);
      toast.success('Driver profile updated successfully');
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Transporter Profile
export const fetchTransporterProfile = createAsyncThunk(
  'profile/fetchTransporterProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getTransporterProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transporter profile');
    }
  }
);

export const updateTransporterProfile = createAsyncThunk(
  'profile/updateTransporterProfile',
  async (data: TransporterProfileUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await profileService.updateTransporterProfile(data);
      toast.success('Transporter profile updated successfully');
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Shipper Profile
export const fetchShipperProfile = createAsyncThunk(
  'profile/fetchShipperProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getShipperProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shipper profile');
    }
  }
);

export const updateShipperProfile = createAsyncThunk(
  'profile/updateShipperProfile',
  async (data: ShipperProfileUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await profileService.updateShipperProfile(data);
      toast.success('Shipper profile updated successfully');
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Documents
export const fetchDocuments = createAsyncThunk(
  'profile/fetchDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getMyDocuments();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'profile/uploadDocument',
  async (data: DocumentUploadRequest, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadDocument(data);
      toast.success('Document uploaded successfully');
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'profile/deleteDocument',
  async (documentId: number, { rejectWithValue }) => {
    try {
      await profileService.deleteDocument(documentId);
      toast.success('Document deleted successfully');
      return documentId;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete document');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document');
    }
  }
);

// Profile Completion
export const fetchProfileCompletion = createAsyncThunk(
  'profile/fetchProfileCompletion',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfileCompletionStatus();
      return response.isComplete;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch completion status');
    }
  }
);

// ==================== Slice ====================

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfiles: (state) => {
      state.driverProfile = null;
      state.transporterProfile = null;
      state.shipperProfile = null;
      state.documents = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Driver Profile
      .addCase(fetchDriverProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.driverProfile = action.payload;
      })
      .addCase(fetchDriverProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDriverProfile.fulfilled, (state, action) => {
        state.driverProfile = action.payload;
      })
      
      // Transporter Profile
      .addCase(fetchTransporterProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransporterProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.transporterProfile = action.payload;
      })
      .addCase(fetchTransporterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTransporterProfile.fulfilled, (state, action) => {
        state.transporterProfile = action.payload;
      })
      
      // Shipper Profile
      .addCase(fetchShipperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shipperProfile = action.payload;
      })
      .addCase(fetchShipperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateShipperProfile.fulfilled, (state, action) => {
        state.shipperProfile = action.payload;
      })
      
      // Documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc.id !== action.payload);
      })
      
      // Profile Completion
      .addCase(fetchProfileCompletion.fulfilled, (state, action) => {
        state.profileComplete = action.payload;
      });
  }
});

export const { clearProfileError, clearProfiles } = profileSlice.actions;
export default profileSlice.reducer;