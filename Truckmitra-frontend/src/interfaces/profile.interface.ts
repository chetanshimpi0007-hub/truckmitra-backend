// src/interfaces/profile.interface.ts

import { Role } from './auth.interface';

export enum PreferredRoute {
  LOCAL = 'LOCAL',
  LONG_HAUL = 'LONG_HAUL',
  BOTH = 'BOTH'
}

export enum DocumentType {
  AADHAAR_FRONT = 'AADHAAR_FRONT',
  AADHAAR_BACK = 'AADHAAR_BACK',
  PAN_CARD = 'PAN_CARD',
  DRIVING_LICENSE_FRONT = 'DRIVING_LICENSE_FRONT',
  DRIVING_LICENSE_BACK = 'DRIVING_LICENSE_BACK',
  GST_CERTIFICATE = 'GST_CERTIFICATE',
  VEHICLE_RC = 'VEHICLE_RC',
  VEHICLE_INSURANCE = 'VEHICLE_INSURANCE',
  BUSINESS_PROOF = 'BUSINESS_PROOF',
  PROFILE_PICTURE = 'PROFILE_PICTURE'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// ==================== DRIVER PROFILE ====================

export interface DriverProfile {
  userId: number;
  fullName: string;
  mobile: string;
  email: string;
  
  // Profile fields
  aadharNumber?: string;
  experienceInYears?: number;
  preferredRoute?: PreferredRoute;
  
  // System managed
  isBooked: boolean;
  totalTrips: number;
  totalEarnings: number;
  liveLatitude?: number;
  liveLongitude?: number;
  currentSpeed?: number;
}

export interface DriverProfileUpdateRequest {
  aadharNumber?: string;
  experienceInYears?: number;
  preferredRoute?: PreferredRoute;
}

// ==================== TRANSPORTER PROFILE ====================

export interface TransporterProfile {
  userId: number;
  fullName: string;
  mobile: string;
  email: string;
  
  // Registration fields
  agencyName: string;
  fleetSize?: number;
  serviceAreas?: string;
  
  // Profile fields
  ownerName?: string;
  panNumber?: string;
  officeAddress?: string;
  
  // System managed
  commissionRate: number;
  bidsWon: number;
  totalEarnings: number;
  totalVehicles: number;
  totalDrivers: number;
}

export interface TransporterProfileUpdateRequest {
  ownerName?: string;
  panNumber?: string;
  officeAddress?: string;
}

// ==================== SHIPPER PROFILE ====================

export interface ShipperProfile {
  userId: number;
  fullName: string;
  mobile: string;
  email: string;
  
  // Registration fields
  companyName: string;
  gstNumber: string;
  businessType: string;
  industryType: string;
  
  // Profile fields
  authorizedPersonName?: string;
  companyPan?: string;
  registeredOfficeAddress?: string;
  
  // System managed
  totalSpent: number;
  activeLoads: number;
  totalLoadsPosted: number;
  averageRating: number;
}

export interface ShipperProfileUpdateRequest {
  authorizedPersonName?: string;
  companyPan?: string;
  registeredOfficeAddress?: string;
}

// ==================== DOCUMENTS ====================

export interface UserDocument {
  id: number;
  userId: number;
  docType: DocumentType;
  docNumber?: string;
  docFrontImageUrl?: string;
  docBackImageUrl?: string;
  verificationStatus: VerificationStatus;
  uploadedAt: string;
  rejectionReason?: string;
}

export interface DocumentUploadRequest {
  docType: DocumentType;
  docNumber?: string;
  docFrontImageUrl?: string;
  docBackImageUrl?: string;
}

// ==================== LOCATION ====================

export interface LocationUpdateRequest {
  latitude: number;
  longitude: number;
  speed?: number;
}

// ==================== API RESPONSE ====================

export interface ProfileCompletionResponse {
  isComplete: boolean;
  missingFields?: string[];
}