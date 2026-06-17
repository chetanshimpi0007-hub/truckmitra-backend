// src/main/java/com/truckmitra/controller/notification/NotificationController.java
package com.truckmitra.controller.notification;

import com.truckmitra.dto.request.NotificationRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.NotificationResponse;
import com.truckmitra.service.notification.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Controller", description = "Notification management APIs")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    @Operation(summary = "Send notification (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> sendNotification(
            @Valid @RequestBody NotificationRequest request) {
        notificationService.sendNotification(request);
        return ResponseEntity.ok(ApiResponse.success("Notification queued successfully", null));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user's notification history")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHIPPER', 'TRANSPORTER', 'DRIVER')")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getUserNotifications(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully", notifications));
    }

    @GetMapping
    @Operation(summary = "Get current user's notifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getMyNotifications(
            @PageableDefault(size = 20) Pageable pageable, org.springframework.security.core.Authentication authentication) {
        // extract userId from authentication
        // using CustomUserDetails
        com.truckmitra.security.CustomUserDetails userDetails = (com.truckmitra.security.CustomUserDetails) authentication.getPrincipal();
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(userDetails.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully", notifications));
    }

    @GetMapping("/{notificationId}")
    @Operation(summary = "Get notification status by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHIPPER', 'TRANSPORTER', 'DRIVER')")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotificationStatus(
            @PathVariable Long notificationId) {
        NotificationResponse notification = notificationService.getNotificationStatus(notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification details fetched successfully", notification));
    }
}