// src/main/java/com/truckmitra/dto/response/user/ShipperProfileResponse.java
package com.truckmitra.dto.response.user;

import com.truckmitra.entity.common.enums.AccountStatus;
import java.time.LocalDateTime;

public record ShipperProfileResponse(
    Long id,
    String fullName,
    String mobile,
    String email,
    String profileImageUrl,
    AccountStatus accountStatus,
    
    // Business details
    String companyName,
    String gstNumber,
    boolean isGstVerified,
    String businessType,
    String industryType,
    String companyLogoUrl,
    
    // Stats
    Integer totalLoadsPosted,
    Integer activeLoads,
    Double totalSpent,
    Double averageRating,
    Integer totalRatings,
    
    // Subscription
    Integer freeLoadsRemaining,
    String subscriptionPlan,
    LocalDateTime subscriptionEndDate,
    
    // Address
    String address,
    String city,
    String state,
    String pincode,
    
    // Wallet
    Double walletBalance,
    String walletNumber,
    
    LocalDateTime createdAt,
    LocalDateTime lastLoginAt
) {}