// src/main/java/com/truckmitra/dto/response/auth/OtpResponse.java
package com.truckmitra.dto.response.auth;

public record OtpResponse(
    String message,
    String mobile,
    boolean isNewUser,
    Integer expirySeconds
) {}