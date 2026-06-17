// src/main/java/com/truckmitra/controller/auth/AuthController.java
package com.truckmitra.controller.auth;

import com.truckmitra.dto.request.auth.*;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.auth.AuthResponse;
import com.truckmitra.dto.response.auth.OtpResponse;
import com.truckmitra.exception.UnauthorizedException;
import com.truckmitra.security.jwt.JwtService;
import com.truckmitra.service.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication APIs for all users")
public class AuthController {

    private final AuthService authService;
    private final com.truckmitra.repository.auth.UserRepository userRepository;

    @GetMapping("/debug-users")
    public ResponseEntity<Iterable<com.truckmitra.entity.user.User>> debugUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP for login/registration")
    public ResponseEntity<ApiResponse<OtpResponse>> sendOtp(
            @Valid @RequestBody OtpRequest request) {
        OtpResponse response = authService.sendOtp(request.mobile());
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user (Driver/Shipper/Transporter)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);  // YEH SAHI HAI
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

//    @PostMapping("/login")
//    @Operation(summary = "Login with mobile and password")
//    public ResponseEntity<ApiResponse<AuthResponse>> login(
//            @Valid @RequestBody LoginRequest request) {
//        AuthResponse response = authService.login(request);
//        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
//    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestHeader("Refresh-Token") String refreshToken) {
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }
 // src/main/java/com/truckmitra/controller/auth/AuthController.java
 // Add these endpoints

     @PostMapping("/login")
     @Operation(summary = "Login with email/password, phone/OTP, or Google")
     public ResponseEntity<ApiResponse<AuthResponse>> login(
             @Valid @RequestBody LoginRequest request) {
         AuthResponse response = authService.login(request);
         return ResponseEntity.ok(ApiResponse.success("Login successful", response));
     }

     @PostMapping("/login/google")
     @Operation(summary = "Login with Google token")
     public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(
             @RequestParam String googleToken,
             @RequestParam(required = false) String deviceToken) {
         AuthResponse response = authService.loginWithGoogle(googleToken, deviceToken);
         return ResponseEntity.ok(ApiResponse.success("Google login successful", response));
     }

     @PostMapping("/login/facebook")
     @Operation(summary = "Login with Facebook token")
     public ResponseEntity<ApiResponse<AuthResponse>> loginWithFacebook(
             @RequestParam String facebookToken,
             @RequestParam(required = false) String deviceToken) {
         AuthResponse response = authService.loginWithFacebook(facebookToken, deviceToken);
         return ResponseEntity.ok(ApiResponse.success("Facebook login successful", response));
     }

     @PostMapping("/otp/generate")
     @Operation(summary = "Generate OTP for mobile login")
     public ResponseEntity<ApiResponse<String>> generateOtp(
             @Valid @RequestBody OtpRequest request) {
         String otp = authService.generateOtp(request.mobile());
         // Don't return OTP in response in production!
         return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", otp));
     }

     @PostMapping("/otp/verify")
     @Operation(summary = "Verify OTP and login")
     public ResponseEntity<ApiResponse<AuthResponse>> verifyOtpAndLogin(
             @Valid @RequestBody OtpVerificationRequest request,
             @RequestParam(required = false) String deviceToken) {
         AuthResponse response = authService.loginWithOtp(
             request.mobile(), request.otp(), deviceToken);
         return ResponseEntity.ok(ApiResponse.success("Login successful", response));
     }
    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset OTP")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset OTP sent", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password with OTP")
    public ResponseEntity<ApiResponse<AuthResponse>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        AuthResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successful", response));
    }

 // AuthController.java mein JwtService inject karein
    private final JwtService jwtService; 

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // "Bearer " hatane ke liye
        Long userId = jwtService.extractUserId(jwt); // JwtService ka use karein jo aapne pehle define kiya hai
        
        if (userId == null) {
            throw new UnauthorizedException("Invalid token during logout");
        }
        
        authService.logout(userId);
        return ResponseEntity.ok(ApiResponse.<Void>success("Logout successful", null));
    }

    @GetMapping("/generate-debug-token/{userId}")
    public ResponseEntity<String> generateDebugToken(@PathVariable Long userId) {
        com.truckmitra.entity.user.User user = userRepository.findById(userId).orElseThrow();
        org.springframework.security.core.userdetails.UserDetails userDetails = 
            new com.truckmitra.security.CustomUserDetails(
                user.getMobile() != null ? user.getMobile() : user.getEmail(),
                user.getPassword(),
                java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                user.getId()
            );
        return ResponseEntity.ok(jwtService.generateToken(userDetails, user.getId(), user.getRole().name()));
    }

    @GetMapping("/validate-token")
    @Operation(summary = "Validate JWT token")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(
            @RequestHeader("Authorization") String token) {
        boolean isValid = authService.validateToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(ApiResponse.<Boolean>success("Token validation complete", isValid));
    }

    private Long extractUserIdFromToken(String token) {
        // Implementation to extract user ID from JWT token
        // This would use JwtService
        return null; // Placeholder
    }

    // Inner class for OTP request
    public record OtpRequest(
        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
        String mobile
    ) {}
}