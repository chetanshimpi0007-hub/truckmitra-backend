// src/services/profile.service.ts

import {   DriverProfile,
  DriverProfileUpdateRequest,
  TransporterProfile,
  TransporterProfileUpdateRequest,
  ShipperProfile,
  ShipperProfileUpdateRequest,
  UserDocument,
  DocumentUploadRequest,
  LocationUpdateRequest,
  ProfileCompletionResponse } from "../../interfaces/profile.interface";
import protectedApi from "../api/protectedAndPublicAPI";


class ProfileService {
  
  private getUserId(): number {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr).id;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  // ==================== DRIVER PROFILE ====================
  
  async getDriverProfile(): Promise<DriverProfile> {
    const response = await protectedApi.get(`/api/profile/driver/${this.getUserId()}`);
    return response.data.data;
  }
  
  async updateDriverProfile(data: DriverProfileUpdateRequest): Promise<DriverProfile> {
    const response = await protectedApi.put(`/api/profile/driver/${this.getUserId()}`, data);
    return response.data.data;
  }
  
  // ==================== TRANSPORTER PROFILE ====================
  
  async getTransporterProfile(): Promise<TransporterProfile> {
    const response = await protectedApi.get(`/api/profile/transporter/${this.getUserId()}`);
    return response.data.data;
  }
  
  async updateTransporterProfile(data: TransporterProfileUpdateRequest): Promise<TransporterProfile> {
    const response = await protectedApi.put(`/api/profile/transporter/${this.getUserId()}`, data);
    return response.data.data;
  }
  
  // ==================== SHIPPER PROFILE ====================
  
  async getShipperProfile(): Promise<ShipperProfile> {
    const response = await protectedApi.get(`/api/profile/shipper/${this.getUserId()}`);
    return response.data.data;
  }
  
  async updateShipperProfile(data: ShipperProfileUpdateRequest): Promise<ShipperProfile> {
    const response = await protectedApi.put(`/api/profile/shipper/${this.getUserId()}`, data);
    return response.data.data;
  }
  
  // ==================== DOCUMENTS ====================
  
  // src/services/profile.service.ts mein DocumentUpload function update karo

async uploadDocument(data: DocumentUploadRequest): Promise<UserDocument> {
  // Data already contains Cloudinary URLs
  const response = await protectedApi.post('/api/profile/documents', data);
  return response.data.data;
}
  
  async getMyDocuments(): Promise<UserDocument[]> {
    const response = await protectedApi.get('/api/profile/documents');
    return response.data.data;
  }
  
  async getDocumentById(documentId: number): Promise<UserDocument> {
    const response = await protectedApi.get(`/api/profile/documents/${documentId}`);
    return response.data.data;
  }
  
  async deleteDocument(documentId: number): Promise<void> {
    await protectedApi.delete(`/api/profile/documents/${documentId}`);
  }
  
  // ==================== LOCATION (Driver only) ====================
  
  async updateDriverLocation(data: LocationUpdateRequest): Promise<void> {
    await protectedApi.post('/api/profile/driver/location', null, {
      params: {
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed
      }
    });
  }
  
  // ==================== PROFILE COMPLETION ====================
  
  async getProfileCompletionStatus(): Promise<ProfileCompletionResponse> {
    const response = await protectedApi.get('/api/profile/completion-status');
    return { isComplete: response.data.data };
  }
}

export default new ProfileService();