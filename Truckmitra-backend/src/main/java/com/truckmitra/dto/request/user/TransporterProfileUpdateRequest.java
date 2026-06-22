// src/main/java/com/truckmitra/dto/request/user/TransporterProfileUpdateRequest.java
package com.truckmitra.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public record TransporterProfileUpdateRequest(
    String fullName,
    
    @Email(message = "Invalid email format")
    String email,
    
    String address,
    String city,
    String state,
    String pincode,
    
    // Business details
    String agencyName,
    
    @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", 
             message = "Invalid GST number")
    String gstNumber,
    
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN number")
    String panNumber,
    
    String officeAddress,
    Integer fleetSize,
    String serviceAreas,
    
    // Preferences
    Boolean pushNotificationsEnabled,
    Boolean emailNotificationsEnabled,
    Boolean smsNotificationsEnabled,

    // Frontend specific mapping fields
    String ownerName
) {}