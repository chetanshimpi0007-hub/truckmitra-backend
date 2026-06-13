// src/main/java/com/truckmitra/dto/admin/response/UserDetailResponse.java
package com.truckmitra.dto.admin.response;

import com.truckmitra.entity.user.*;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public record UserDetailResponse(
    Long id,
    String fullName,
    String mobile,
    String email,
    Role role,
    AccountStatus accountStatus,
    LocalDateTime registeredAt,
    String registeredIp,
    LocalDateTime lastLoginAt,
    Long verifiedBy,
    LocalDateTime verifiedAt,
    Boolean isActive,
    Boolean isProfileCompleted,
    Boolean isVerified,
    Map<String, Object> profileDetails
) {
    public static UserDetailResponse fromUser(User user) {
        Map<String, Object> profileDetails = extractProfileDetails(user);
        
        return new UserDetailResponse(
            user.getId(),
            user.getFullName(),
            user.getMobile(),
            user.getEmail(),
            user.getRole(),
            user.getAccountStatus(),
            user.getRegisteredAt(),
            user.getRegisteredIp(),
            user.getLastLoginAt(),
            user.getVerifiedBy(),
            user.getVerifiedAt(),
            user.getIsActive(),
            user.getIsProfileCompleted(),
            user.getIsVerified(),
            profileDetails
        );
    }
    
    private static Map<String, Object> extractProfileDetails(User user) {
        Map<String, Object> details = new HashMap<>();
        
        if (user instanceof Driver driver) {
            addIfNotNull(details, "drivingLicenseNumber", driver.getDrivingLicenseNumber());
            addIfNotNull(details, "licenseExpiryDate", driver.getLicenseExpiryDate());
            addIfNotNull(details, "preferredVehicleType", driver.getPreferredVehicleType());
            addIfNotNull(details, "isAvailable", driver.getIsAvailable());
            addIfNotNull(details, "totalTripsCompleted", driver.getTotalTripsCompleted());
            addIfNotNull(details, "rating", driver.getRating());
            addIfNotNull(details, "emergencyContactName", driver.getEmergencyContactName());
            addIfNotNull(details, "emergencyContactNumber", driver.getEmergencyContactNumber());
            addIfNotNull(details, "drivingLicenseImageUrl", driver.getDrivingLicenseImageUrl());
            addIfNotNull(details, "aadhaarFrontImageUrl", driver.getAadhaarFrontImageUrl());
            addIfNotNull(details, "aadhaarBackImageUrl", driver.getAadhaarBackImageUrl());
            addIfNotNull(details, "panCardImageUrl", driver.getPanCardImageUrl());
            addIfNotNull(details, "vehiclePucImageUrl", driver.getVehiclePucImageUrl());
            addIfNotNull(details, "vehicleFrontImageUrl", driver.getVehicleFrontImageUrl());
            addIfNotNull(details, "vehicleBackImageUrl", driver.getVehicleBackImageUrl());
            addIfNotNull(details, "vehicleInsuranceImageUrl", driver.getVehicleInsuranceImageUrl());
            addIfNotNull(details, "aadhaarNumber", driver.getAadhaarNumber());
            addIfNotNull(details, "panNumber", driver.getPanNumber());
            addIfNotNull(details, "totalEarnings", driver.getTotalEarnings());
            addIfNotNull(details, "transporterId", driver.getTransporterId());
        }
        
        else if (user instanceof Shipper shipper) {
            addIfNotNull(details, "companyName", shipper.getCompanyName());
            addIfNotNull(details, "gstNumber", shipper.getGstNumber());
            addIfNotNull(details, "businessType", shipper.getBusinessType());
            addIfNotNull(details, "industryType", shipper.getIndustryType());
            addIfNotNull(details, "isGstVerified", shipper.getIsGstVerified());
            addIfNotNull(details, "totalLoadsPosted", shipper.getTotalLoadsPosted());
            addIfNotNull(details, "freeLoadsRemaining", shipper.getFreeLoadsRemaining());
            addIfNotNull(details, "activeLoads", shipper.getActiveLoads());
            addIfNotNull(details, "averageRating", shipper.getAverageRating());
            addIfNotNull(details, "totalSpent", shipper.getTotalSpent());
            addIfNotNull(details, "companyLogoUrl", shipper.getCompanyLogoUrl());
            addIfNotNull(details, "businessProofUrl", shipper.getBusinessProofUrl());
            addIfNotNull(details, "gstCertificateUrl", shipper.getGstCertificateUrl());
            addIfNotNull(details, "aadhaarFrontImageUrl", shipper.getAadhaarFrontImageUrl());
            addIfNotNull(details, "aadhaarBackImageUrl", shipper.getAadhaarBackImageUrl());
            addIfNotNull(details, "panCardImageUrl", shipper.getPanCardImageUrl());
            addIfNotNull(details, "panNumber", shipper.getPanNumber());
            addIfNotNull(details, "subscriptionPlan", shipper.getSubscriptionPlan());
            addIfNotNull(details, "subscriptionStartDate", shipper.getSubscriptionStartDate());
            addIfNotNull(details, "subscriptionEndDate", shipper.getSubscriptionEndDate());
        }
        
        else if (user instanceof Transporter transporter) {
            addIfNotNull(details, "agencyName", transporter.getAgencyName());
            addIfNotNull(details, "fleetSize", transporter.getFleetSize());
            addIfNotNull(details, "serviceAreas", transporter.getServiceAreas());
            addIfNotNull(details, "experienceInYears", transporter.getExperienceInYears());
            addIfNotNull(details, "gstNumber", transporter.getGstNumber());
            addIfNotNull(details, "isVerified", transporter.getIsVerified());
            addIfNotNull(details, "bidsWon", transporter.getBidsWon());
            addIfNotNull(details, "freeBidsRemaining", transporter.getFreeBidsRemaining());
            addIfNotNull(details, "totalDrivers", transporter.getTotalDrivers());
            addIfNotNull(details, "totalVehicles", transporter.getTotalVehicles());
            addIfNotNull(details, "totalEarnings", transporter.getTotalEarnings());
            addIfNotNull(details, "averageRating", transporter.getAverageRating());
            addIfNotNull(details, "averageDriverRating", transporter.getAverageDriverRating());
            addIfNotNull(details, "totalRatings", transporter.getTotalRatings());
            addIfNotNull(details, "totalDriverRatings", transporter.getTotalDriverRatings());
            addIfNotNull(details, "commissionRate", transporter.getCommissionRate());
            addIfNotNull(details, "officeAddress", transporter.getOfficeAddress());
            addIfNotNull(details, "businessCardUrl", transporter.getBusinessCardUrl());
            addIfNotNull(details, "gstCertificateUrl", transporter.getGstCertificateUrl());
            addIfNotNull(details, "aadhaarFrontImageUrl", transporter.getAadhaarFrontImageUrl());
            addIfNotNull(details, "aadhaarBackImageUrl", transporter.getAadhaarBackImageUrl());
            addIfNotNull(details, "panCardImageUrl", transporter.getPanCardImageUrl());
            addIfNotNull(details, "panNumber", transporter.getPanNumber());
            addIfNotNull(details, "subscriptionPlan", transporter.getSubscriptionPlan());
            addIfNotNull(details, "subscriptionStartDate", transporter.getSubscriptionStartDate());
            addIfNotNull(details, "subscriptionEndDate", transporter.getSubscriptionEndDate());
        }
        
        return details;
    }
    
    private static void addIfNotNull(Map<String, Object> map, String key, Object value) {
        if (value != null) {
            map.put(key, value);
        }
    }
}