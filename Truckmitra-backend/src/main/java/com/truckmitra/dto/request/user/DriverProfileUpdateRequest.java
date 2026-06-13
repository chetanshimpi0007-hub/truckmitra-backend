// src/main/java/com/truckmitra/dto/request/user/DriverProfileUpdateRequest.java
package com.truckmitra.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record DriverProfileUpdateRequest(
    String fullName,
    
    @Email(message = "Invalid email format")
    String email,
    
    String address,
    String city,
    String state,
    String pincode,
    
    // Driver specific
    String drivingLicenseNumber,
    LocalDate licenseExpiryDate,
    String preferredVehicleType,
    
    // Emergency contact
    String emergencyContactName,
    String emergencyContactNumber,
    
    // Bank details
    String accountHolderName,
    String bankName,
    String accountNumber,
    
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC code")
    String ifscCode,
    
    String upiId
) {}