// src/main/java/com/truckmitra/dto/response/user/DriverProfileResponse.java
package com.truckmitra.dto.response.user;

import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.VehicleType;
import java.time.LocalDateTime;
import java.time.LocalDate;

public record DriverProfileResponse(
    Long id,
    String fullName,
    String mobile,
    String email,
    String profileImageUrl,
    AccountStatus accountStatus,
    
    // Driver specific
    String drivingLicenseNumber,
    LocalDate licenseExpiryDate,
    boolean isLicenseVerified,
    String aadhaarNumber,
    boolean isAadhaarVerified,
    VehicleType preferredVehicleType,
    
    // Stats
    Integer totalTripsCompleted,
    Double totalEarnings,
    Double rating,
    Integer totalRatings,
    
    // Availability
    boolean isAvailable,
    boolean isOnTrip,
    Double currentLatitude,
    Double currentLongitude,
    
    // Bank details
    String accountHolderName,
    String bankName,
    String ifscCode,
    boolean isBankDetailsAdded,
    
    // Emergency contact
    String emergencyContactName,
    String emergencyContactNumber,
    
    // Wallet
    Double walletBalance,
    String walletNumber,
    
    // Timestamps
    LocalDateTime createdAt,
    LocalDateTime lastLoginAt
) {}