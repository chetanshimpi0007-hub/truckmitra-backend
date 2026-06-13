// src/main/java/com/truckmitra/common/utils/OtpGenerator.java
package com.truckmitra.common.utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpGenerator {

    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpDetails> otpStore = new ConcurrentHashMap<>();

    private static final int OTP_EXPIRY_SECONDS = 300; // 5 minutes

    public String generateOtp(String mobile) {
        String otp = String.format("%06d", random.nextInt(1000000));
        OtpDetails details = new OtpDetails(otp, System.currentTimeMillis() + (OTP_EXPIRY_SECONDS * 1000));
        otpStore.put(mobile, details);
        return otp;
    }

    public boolean validateOtp(String mobile, String otp) {
        OtpDetails details = otpStore.get(mobile);
        
        if (details == null) {
            return false;
        }

        if (System.currentTimeMillis() > details.expiryTime) {
            otpStore.remove(mobile);
            return false;
        }

        boolean isValid = details.otp.equals(otp);
        if (isValid) {
            otpStore.remove(mobile); // Remove after successful validation
        }
        return isValid;
    }

    public int getExpirySeconds() {
        return OTP_EXPIRY_SECONDS;
    }

    private static class OtpDetails {
        String otp;
        long expiryTime;

        OtpDetails(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}