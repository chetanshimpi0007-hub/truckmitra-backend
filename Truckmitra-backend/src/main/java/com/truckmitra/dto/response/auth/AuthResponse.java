// src/main/java/com/truckmitra/dto/response/auth/AuthResponse.java
package com.truckmitra.dto.response.auth;

import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthResponse(
    Long id,
    String fullName,
    String mobile,
    String email,
    Role role,
    AccountStatus accountStatus,
    String token,
    String refreshToken,
    String profileImageUrl,
    boolean isProfileComplete,
    WalletInfo wallet,           // ✅ Use WalletInfo, not Wallet entity
    String statusMessage,
    boolean canUseBusinessFeatures
) {
    
    // WalletInfo inner record
    public record WalletInfo(
        String walletNumber,
        double currentBalance,
        boolean isActive
    ) {}
    
    // Builder pattern for easy construction
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }
    
    public static class AuthResponseBuilder {
        private Long id;
        private String fullName;
        private String mobile;
        private String email;
        private Role role;
        private AccountStatus accountStatus;
        private String token;
        private String refreshToken;
        private String profileImageUrl;
        private boolean isProfileComplete;
        private WalletInfo wallet;
        
        public AuthResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public AuthResponseBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }
        
        public AuthResponseBuilder mobile(String mobile) {
            this.mobile = mobile;
            return this;
        }
        
        public AuthResponseBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public AuthResponseBuilder role(Role role) {
            this.role = role;
            return this;
        }
        
        public AuthResponseBuilder accountStatus(AccountStatus accountStatus) {
            this.accountStatus = accountStatus;
            return this;
        }
        
        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }
        
        public AuthResponseBuilder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }
        
        public AuthResponseBuilder profileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
            return this;
        }
        
        public AuthResponseBuilder isProfileComplete(boolean isProfileComplete) {
            this.isProfileComplete = isProfileComplete;
            return this;
        }
        
        public AuthResponseBuilder wallet(WalletInfo wallet) {
            this.wallet = wallet;
            return this;
        }
        
        public AuthResponse build() {
            String statusMessage = getStatusMessage(accountStatus);
            boolean canUseBusinessFeatures = determineBusinessAccess(accountStatus, role);
            
            return new AuthResponse(
                id, fullName, mobile, email, role, accountStatus,
                token, refreshToken, profileImageUrl, isProfileComplete,
                wallet, statusMessage, canUseBusinessFeatures
            );
        }
        
        private String getStatusMessage(AccountStatus status) {
            if (status == null) return null;
            
            return switch (status) {
                case REGISTERED -> 
                    "👋 Welcome! Please complete your profile (add vehicle/documents) to start using the platform.";
                case PENDING_VERIFICATION -> 
                    "⏳ Your profile is complete and pending verification. You will be able to use all features after admin approval.";
                case VERIFIED -> 
                    "✅ Your account is fully verified. Enjoy all features!";
                case REJECTED -> 
                    "❌ Your verification was rejected. Please check your documents and resubmit or contact support.";
                case SUSPENDED -> 
                    "⚠️ Your account is suspended. Please contact support at support@truckmitra.com for assistance.";
                case DELETED -> 
                    "🗑️ This account has been deleted. If you think this is a mistake, please contact support.";
                default -> "Account status: " + status.getDisplayName();
            };
        }
        
        private boolean determineBusinessAccess(AccountStatus status, Role role) {
            // Admin always has access
            if (role == Role.ADMIN) return true;
            
            // Only VERIFIED users can use business features
            return status == AccountStatus.VERIFIED;
        }
    }
}