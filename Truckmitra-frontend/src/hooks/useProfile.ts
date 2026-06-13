// src/hooks/useProfile.ts

import { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './redux.hook';
import {
  fetchDriverProfile,
  fetchTransporterProfile,
  fetchShipperProfile,
  fetchDocuments,
  fetchProfileCompletion,
  updateDriverProfile,
  updateTransporterProfile,
  updateShipperProfile,
  uploadDocument,
  deleteDocument,
  clearProfileError
} from '../slices/profileSlice';
import { useAuth } from './auth.hook';
import {
  DocumentUploadRequest,
  DriverProfileUpdateRequest,
  ShipperProfileUpdateRequest,
  TransporterProfileUpdateRequest
} from '../interfaces/profile.interface';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  const {
    driverProfile,
    transporterProfile,
    shipperProfile,
    documents,
    loading,
    error,
    profileComplete
  } = useAppSelector((state) => state.profile);

  // Handle errors
  useEffect(() => {
    if (error) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        toast.error(error);
      }
      dispatch(clearProfileError());
    }
  }, [error, dispatch]);

  // Load profile based on user role
  const loadProfile = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      switch (user.role) {
        case 'DRIVER':
          await dispatch(fetchDriverProfile()).unwrap();
          break;
        case 'TRANSPORTER':
          await dispatch(fetchTransporterProfile()).unwrap();
          break;
        case 'SHIPPER':
          await dispatch(fetchShipperProfile()).unwrap();
          break;
      }
      
      if (user.role !== 'ADMIN') {
        await dispatch(fetchDocuments()).unwrap();
        await dispatch(fetchProfileCompletion()).unwrap();
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }, [dispatch, user]);

  // Update profile based on role - Now returns Promise<void>
  const updateProfile = useCallback(async (data: any): Promise<void> => {
    if (!user) return;

    try {
      let result;
      switch (user.role) {
        case 'DRIVER':
          result = await dispatch(updateDriverProfile(data as DriverProfileUpdateRequest)).unwrap();
          toast.success('Driver profile updated successfully');
          break;
        case 'TRANSPORTER':
          result = await dispatch(updateTransporterProfile(data as TransporterProfileUpdateRequest)).unwrap();
          toast.success('Transporter profile updated successfully');
          break;
        case 'SHIPPER':
          result = await dispatch(updateShipperProfile(data as ShipperProfileUpdateRequest)).unwrap();
          toast.success('Shipper profile updated successfully');
          break;
        default:
          return;
      }

      // Refresh completion status
      await dispatch(fetchProfileCompletion()).unwrap();
      
    } catch (err: any) {
      toast.error(err || 'Failed to update profile');
      throw err; // Re-throw to let component handle if needed
    }
  }, [dispatch, user]);

  // Document operations - Returns Promise<void>
  const uploadUserDocument = useCallback(async (data: DocumentUploadRequest): Promise<void> => {
    try {
      await dispatch(uploadDocument(data)).unwrap();
      toast.success('Document uploaded successfully');
      // Refresh documents list
      await dispatch(fetchDocuments()).unwrap();
    } catch (err: any) {
      toast.error(err || 'Failed to upload document');
      throw err;
    }
  }, [dispatch]);

  const removeDocument = useCallback(async (documentId: number): Promise<void> => {
    try {
      await dispatch(deleteDocument(documentId)).unwrap();
      toast.success('Document deleted successfully');
      // Refresh documents list
      await dispatch(fetchDocuments()).unwrap();
    } catch (err: any) {
      toast.error(err || 'Failed to delete document');
      throw err;
    }
  }, [dispatch]);

  // Refresh all data
  const refreshProfile = useCallback(async (): Promise<void> => {
    await loadProfile();
  }, [loadProfile]);

  // Get current profile based on role
  const getCurrentProfile = useCallback(() => {
    if (!user) return null;
    
    switch (user.role) {
      case 'DRIVER':
        return driverProfile;
      case 'TRANSPORTER':
        return transporterProfile;
      case 'SHIPPER':
        return shipperProfile;
      default:
        return null;
    }
  }, [user, driverProfile, transporterProfile, shipperProfile]);

  // Check if specific document type exists
  const hasDocument = useCallback((docType: string): boolean => {
    return documents.some((doc: any) => doc.docType === docType);
  }, [documents]);

  // Get document by type
  const getDocumentByType = useCallback((docType: string) => {
    return documents.find((doc: any) => doc.docType === docType);
  }, [documents]);

  return {
    // State
    profile: getCurrentProfile(),
    documents,
    loading,
    profileComplete,
    
    // Helper methods
    hasDocument,
    getDocumentByType,
    
    // Actions (all return Promise<void> now)
    loadProfile,
    updateProfile,
    uploadDocument: uploadUserDocument,
    deleteDocument: removeDocument,
    refreshProfile,
    
    // Role-specific profiles
    driverProfile,
    transporterProfile,
    shipperProfile
  };
};