// src/main/java/com/truckmitra/service/auth/AuthService.java
package com.truckmitra.service.auth;

import com.truckmitra.dto.request.auth.*;
import com.truckmitra.dto.response.auth.AuthResponse;
import com.truckmitra.dto.response.auth.OtpResponse;

public interface AuthService {

    OtpResponse sendOtp(String mobile);

    AuthResponse register(RegisterRequest request);  // Single method for registration

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(String refreshToken);

    void forgotPassword(ForgotPasswordRequest request);

    AuthResponse resetPassword(ResetPasswordRequest request);

    void logout(Long userId);

    boolean validateToken(String token);
 // Add these methods to AuthService.java

    AuthResponse loginWithGoogle(String googleToken, String deviceToken);

    AuthResponse loginWithFacebook(String facebookToken, String deviceToken);

    AuthResponse loginWithOtp(String mobile, String otp, String deviceToken);

    String generateOtp(String mobile);

    boolean verifyOtp(String mobile, String otp);
}