// src/interfaces/auth.interface.ts
export enum Role {
  DRIVER = 'DRIVER',
  SHIPPER = 'SHIPPER',
  TRANSPORTER = 'TRANSPORTER',
  ADMIN = 'ADMIN'
}

// src/interfaces/auth.interface.ts - UPDATE THIS

export enum AccountStatus {
  REGISTERED = 'REGISTERED',              // ✅ New - Just registered
  PENDING_VERIFICATION = 'PENDING_VERIFICATION', // ✅ New - Profile complete
  VERIFIED = 'VERIFIED',                   // ✅ New - Admin verified
  REJECTED = 'REJECTED',                   // ✅ Existing
  SUSPENDED = 'SUSPENDED',                 // ✅ Existing
  DELETED = 'DELETED'                      // ✅ Existing
}

export enum LoginType {
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  PHONE_OTP = 'PHONE_OTP',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK'
}

export interface OtpRequest {
  mobile: string;
}

export interface OtpResponse {
  message: string;
  mobile: string;
  isNewUser: boolean;
  expirySeconds: number;
}

export interface RegisterRequest {
  fullName: string;
  mobile: string;
  email: string;
  password?: string;
  role: Role;
  preferredLoginType: string;
  googleId?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  
  // Driver fields
  drivingLicenseNumber?: string;
  licenseExpiryDate?: string;
  preferredVehicleType?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  
  // Shipper fields
  companyName?: string;
  gstNumber?: string;
  businessType?: string;
  industryType?: string;
  
  // Transporter fields
  agencyName?: string;
  fleetSize?: number;
  serviceAreas?: string;
  experienceInYears?: number;
}

export interface LoginRequest {
  loginType: string;
  email?: string;
  password?: string;
  mobile?: string;
  otp?: string;
  googleToken?: string;
  facebookToken?: string;
  deviceToken?: string;
}

export interface OtpVerificationRequest {
  mobile: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;  // Email instead of mobile
}

export interface ResetPasswordRequest {
  email: string;   // Add email field
  otp: string;     // OTP field
  newPassword: string;
}

export interface WalletInfo {
  walletNumber: string;
  currentBalance: number;
  isActive: boolean;
}

// src/interfaces/auth.interface.ts - UPDATE THIS

export interface AuthResponse {
  id: number;
  fullName: string;
  mobile: string;
  email: string;
  role: Role;
  accountStatus: AccountStatus;
  token: string;
  refreshToken: string;
  profileImageUrl?: string;
  isProfileComplete: boolean;
  wallet?: WalletInfo;
  statusMessage: string;        // ✅ NEW FIELD - Add this
  canUseBusinessFeatures: boolean; // ✅ NEW FIELD - Add this
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}