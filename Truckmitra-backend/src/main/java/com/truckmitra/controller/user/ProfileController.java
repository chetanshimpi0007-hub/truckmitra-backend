// src/main/java/com/truckmitra/controller/user/ProfileController.java
package com.truckmitra.controller.user;

import com.truckmitra.dto.request.user.DriverProfileUpdateRequest;
import com.truckmitra.dto.request.user.ShipperProfileUpdateRequest;
import com.truckmitra.dto.request.user.TransporterProfileUpdateRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.user.DriverProfileResponse;
import com.truckmitra.dto.response.user.ShipperProfileResponse;
import com.truckmitra.dto.response.user.TransporterProfileResponse;
import com.truckmitra.service.user.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Profile management APIs")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/driver/{id}")
    @Operation(summary = "Get driver profile")
    @PreAuthorize("hasAnyRole('DRIVER', 'TRANSPORTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<DriverProfileResponse>> getDriverProfile(@PathVariable Long id) {
        DriverProfileResponse profile = profileService.getDriverProfile(id);
        return ResponseEntity.ok(ApiResponse.success("Driver profile fetched", profile));
    }

    @GetMapping("/shipper/{id}")
    @Operation(summary = "Get shipper profile")
    @PreAuthorize("hasAnyRole('SHIPPER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ShipperProfileResponse>> getShipperProfile(@PathVariable Long id) {
        ShipperProfileResponse profile = profileService.getShipperProfile(id);
        return ResponseEntity.ok(ApiResponse.success("Shipper profile fetched", profile));
    }

    @GetMapping("/transporter/{id}")
    @Operation(summary = "Get transporter profile")
    @PreAuthorize("hasAnyRole('TRANSPORTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TransporterProfileResponse>> getTransporterProfile(@PathVariable Long id) {
        TransporterProfileResponse profile = profileService.getTransporterProfile(id);
        return ResponseEntity.ok(ApiResponse.success("Transporter profile fetched", profile));
    }

    @PutMapping("/driver/{id}")
    @Operation(summary = "Update driver profile")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<DriverProfileResponse>> updateDriverProfile(
            @PathVariable Long id,
            @RequestBody DriverProfileUpdateRequest request) {
        DriverProfileResponse profile = profileService.updateDriverProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", profile));
    }

    @PutMapping("/shipper/{id}")
    @Operation(summary = "Update shipper profile")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<ShipperProfileResponse>> updateShipperProfile(
            @PathVariable Long id,
            @RequestBody ShipperProfileUpdateRequest request) {
        ShipperProfileResponse profile = profileService.updateShipperProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", profile));
    }

    @PutMapping("/transporter/{id}")
    @Operation(summary = "Update transporter profile")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<ApiResponse<TransporterProfileResponse>> updateTransporterProfile(
            @PathVariable Long id,
            @RequestBody TransporterProfileUpdateRequest request) {
        TransporterProfileResponse profile = profileService.updateTransporterProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", profile));
    }

    @PostMapping("/{id}/upload-image")
    @Operation(summary = "Upload profile image")
    @PreAuthorize("hasAnyRole('DRIVER', 'SHIPPER', 'TRANSPORTER')")
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String imageUrl = profileService.uploadProfileImage(id, file);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded", imageUrl));
    }

    @PostMapping("/driver/{id}/upload-documents")
    @Operation(summary = "Upload driver documents")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Void>> uploadDriverDocuments(
            @PathVariable Long id,
            @RequestParam("license") MultipartFile license,
            @RequestParam("aadhaar") MultipartFile aadhaar) {
        profileService.uploadDriverDocuments(id, license, aadhaar);
        return ResponseEntity.ok(ApiResponse.success("Documents uploaded", null));
    }

    @GetMapping("/driver/{id}/availability")
    @Operation(summary = "Toggle driver availability")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Boolean>> toggleAvailability(@PathVariable Long id) {
        boolean status = profileService.toggleDriverAvailability(id);
        return ResponseEntity.ok(ApiResponse.success("Availability toggled", status));
    }

    @PostMapping("/documents")
    @Operation(summary = "Upload general document")
    @PreAuthorize("hasAnyRole('DRIVER', 'SHIPPER', 'TRANSPORTER')")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> uploadDocument(
            @RequestBody com.truckmitra.dto.request.user.DocumentUploadRequest request) {
        Long userId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        java.util.Map<String, Object> result = profileService.uploadDocument(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", result));
    }

    @GetMapping("/documents")
    @Operation(summary = "Get my uploaded documents")
    @PreAuthorize("hasAnyRole('DRIVER', 'SHIPPER', 'TRANSPORTER')")
    public ResponseEntity<ApiResponse<java.util.List<java.util.Map<String, Object>>>> getMyDocuments() {
        Long userId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        java.util.List<java.util.Map<String, Object>> result = profileService.getMyDocuments(userId);
        return ResponseEntity.ok(ApiResponse.success("Documents fetched successfully", result));
    }

    @GetMapping("/completion-status")
    @Operation(summary = "Get profile completion status")
    @PreAuthorize("hasAnyRole('DRIVER', 'SHIPPER', 'TRANSPORTER')")
    public ResponseEntity<ApiResponse<Boolean>> getProfileCompletionStatus() {
        Long userId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        boolean isComplete = profileService.isProfileCompleted(userId);
        return ResponseEntity.ok(ApiResponse.success("Completion status fetched successfully", isComplete));
    }
}