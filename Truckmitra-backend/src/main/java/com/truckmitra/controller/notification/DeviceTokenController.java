package com.truckmitra.controller.notification;

import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.user.DeviceToken;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.user.DeviceTokenRepository;
import com.truckmitra.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/device-tokens")
@RequiredArgsConstructor
public class DeviceTokenController {

    private final DeviceTokenRepository deviceTokenRepository;
    private final com.truckmitra.repository.auth.UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Register a new device token for push notifications")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> registerToken(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> payload) {
            
        String token = payload.get("token");
        String deviceOs = payload.get("deviceOs");
        
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Token is required"));
        }
        
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        
        // Remove existing token if present
        deviceTokenRepository.findByToken(token).ifPresent(existing -> 
            deviceTokenRepository.delete(existing)
        );
        
        DeviceToken deviceToken = new DeviceToken();
        deviceToken.setUser(user);
        deviceToken.setToken(token);
        deviceToken.setDeviceOs(deviceOs);
        deviceToken.setIsActive(true);
        deviceToken.setLastActive(LocalDateTime.now());
        
        deviceTokenRepository.save(deviceToken);
        
        return ResponseEntity.ok(ApiResponse.success("Device token registered", null));
    }

    @DeleteMapping
    @Operation(summary = "Unregister a device token")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> unregisterToken(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> payload) {
            
        String token = payload.get("token");
        
        if (token != null) {
            deviceTokenRepository.deleteByToken(token);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Device token unregistered", null));
    }
}
