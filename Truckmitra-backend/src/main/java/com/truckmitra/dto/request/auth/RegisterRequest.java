package com.truckmitra.dto.request.auth;

import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.common.enums.LoginType;
import jakarta.validation.constraints.*;

public record RegisterRequest(
    // Common fields
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String fullName,

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    String mobile,

    @Email(message = "Invalid email format")
    String email,

    String password, // Optional for OTP/Google login

    @NotNull(message = "Role is required")
    Role role,

    @NotNull(message = "Login type is required")
    String preferredLoginType, // EMAIL_PASSWORD, PHONE_OTP, GOOGLE

    // For Google login
    String googleId,

    // Common fields
    String address,
    String landmark,
    String area,
    String city,
    String state,
    String pincode,

    // Shared identity fields for all roles
    String aadhaarNumber,
    String aadhaarFrontImageUrl,
    String aadhaarBackImageUrl,
    String panNumber,
    String panCardImageUrl,

    // Driver specific fields
    String drivingLicenseNumber,
    String licenseExpiryDate,
    String licenseImageUrl,
    String vehicleNumber,
    String vehicleCapacity,
    String vehiclePucImageUrl,
    String vehicleFrontImageUrl,
    String vehicleBackImageUrl,
    String vehicleInsuranceImageUrl,
    String vehicleFuelType,
    String preferredVehicleType,
    String emergencyContactName,
    String emergencyContactNumber,

    // Shipper specific fields
    String companyName,
    String gstNumber,
    String businessType,
    String industryType,

    // Transporter specific fields
    String agencyName,
    Integer fleetSize,
    String serviceAreas,
    Integer experienceInYears
) {
    public LoginType getPreferredLoginTypeEnum() {
        return LoginType.fromString(preferredLoginType);
    }
}