// src/main/java/com/truckmitra/service/user/ProfileService.java
package com.truckmitra.service.user;

import com.truckmitra.dto.request.user.DriverProfileUpdateRequest;
import com.truckmitra.dto.request.user.ShipperProfileUpdateRequest;
import com.truckmitra.dto.request.user.TransporterProfileUpdateRequest;
import com.truckmitra.dto.response.user.DriverProfileResponse;
import com.truckmitra.dto.response.user.ShipperProfileResponse;
import com.truckmitra.dto.response.user.TransporterProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
    
    // Get profiles
    DriverProfileResponse getDriverProfile(Long driverId);
    ShipperProfileResponse getShipperProfile(Long shipperId);
    TransporterProfileResponse getTransporterProfile(Long transporterId);
    
    // Update profiles
    DriverProfileResponse updateDriverProfile(Long driverId, DriverProfileUpdateRequest request);
    ShipperProfileResponse updateShipperProfile(Long shipperId, ShipperProfileUpdateRequest request);
    TransporterProfileResponse updateTransporterProfile(Long transporterId, TransporterProfileUpdateRequest request);
    
    // Document upload
    String uploadProfileImage(Long userId, MultipartFile file);
    void uploadDriverDocuments(Long driverId, MultipartFile license, MultipartFile aadhaar);
    
    // Availability
    boolean toggleDriverAvailability(Long driverId);
    
    // Documents and Profile Completion
    java.util.Map<String, Object> uploadDocument(Long userId, com.truckmitra.dto.request.user.DocumentUploadRequest request);
    java.util.List<java.util.Map<String, Object>> getMyDocuments(Long userId);
    boolean isProfileCompleted(Long userId);
}