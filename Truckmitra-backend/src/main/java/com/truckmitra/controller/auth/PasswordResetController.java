package com.truckmitra.controller.auth;

import com.truckmitra.service.auth.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password-reset")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String emailOrMobile = payload.get("identifier");
        if (emailOrMobile == null || emailOrMobile.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Identifier is required"));
        }
        
        passwordResetService.generateResetToken(emailOrMobile);
        
        // Always return success to prevent user enumeration
        return ResponseEntity.ok(Map.of("message", "If an account exists, a reset link will be sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");
        
        if (token == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid request. Password must be at least 6 characters."));
        }

        try {
            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password has been successfully reset."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
