// src/main/java/com/truckmitra/dto/request/auth/LoginRequest.java
package com.truckmitra.dto.request.auth;

import com.truckmitra.entity.common.enums.LoginType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;

public record LoginRequest(
    @NotBlank(message = "Login type is required")
    String loginType, // EMAIL_PASSWORD, PHONE_OTP, GOOGLE, FACEBOOK

    // For EMAIL_PASSWORD
    String email,

    // For EMAIL_PASSWORD
    String password,

    // For PHONE_OTP
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    String mobile,

    // For PHONE_OTP
    @Pattern(regexp = "^\\d{6}$", message = "OTP must be 6 digits")
    String otp,

    // For GOOGLE
    String googleToken,

    // For FACEBOOK
    String facebookToken,

    // For all types
    String deviceToken // For push notifications
) {
    // Add this missing method
    public LoginType getLoginTypeEnum() {
        try {
            return LoginType.valueOf(loginType.toUpperCase());
        } catch (IllegalArgumentException e) {
            return LoginType.EMAIL_PASSWORD; // default
        }
    }

    // Validation helper methods
    public boolean isValidEmailPassword() {
        return loginType.equalsIgnoreCase("EMAIL_PASSWORD") && 
               email != null && !email.isBlank() && 
               password != null && !password.isBlank();
    }

    public boolean isValidPhoneOtp() {
        return loginType.equalsIgnoreCase("PHONE_OTP") && 
               mobile != null && mobile.matches("^[6-9]\\d{9}$") && 
               otp != null && otp.matches("^\\d{6}$");
    }

    public boolean isValidGoogle() {
        return loginType.equalsIgnoreCase("GOOGLE") && 
               googleToken != null && !googleToken.isBlank();
    }

    public boolean isValidFacebook() {
        return loginType.equalsIgnoreCase("FACEBOOK") && 
               facebookToken != null && !facebookToken.isBlank();
    }
}