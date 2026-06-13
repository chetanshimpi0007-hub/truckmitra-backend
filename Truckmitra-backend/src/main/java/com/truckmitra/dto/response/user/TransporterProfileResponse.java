// src/main/java/com/truckmitra/dto/response/user/TransporterProfileResponse.java
package com.truckmitra.dto.response.user;

import com.truckmitra.entity.common.enums.AccountStatus;
import java.time.LocalDateTime;
import java.util.List;

public record TransporterProfileResponse(
    Long id,
    String fullName,
    String mobile,
    String email,
    String profileImageUrl,
    AccountStatus accountStatus,
    
    // Business details
    String agencyName,
    String gstNumber,
    String panNumber,
    boolean isVerified,
    String officeAddress,
    
    // Fleet stats
    Integer fleetSize,
    Integer totalDrivers,
    Integer totalVehicles,
    List<Long> driverIds,
    List<Long> vehicleIds,
    
    // Performance
    Integer bidsWon,
    Double averageRating,
    Integer totalRatings,
    Double averageDriverRating,
    Double totalEarnings,
    
    // Service areas
    String serviceAreas,
    Integer experienceInYears,
    
    // Subscription
    Integer freeBidsRemaining,
    String subscriptionPlan,
    LocalDateTime subscriptionEndDate,
    Double commissionRate,
    
    // Wallet
    Double walletBalance,
    String walletNumber,
    
    LocalDateTime createdAt,
    LocalDateTime lastLoginAt
) {}