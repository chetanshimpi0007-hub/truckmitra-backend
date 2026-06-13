// src/main/java/com/truckmitra/entity/common/enums/AccountStatus.java
package com.truckmitra.entity.common.enums;

public enum AccountStatus {
    // ✅ New status for initial registration
    REGISTERED("Registered", "User registered, can login and complete profile"),
    
    // ✅ Status after profile completion (vehicle/docs added)
    PROFILE_COMPLETED("Profile Completed", "User completed profile, pending verification"),
    
    // ✅ Status after admin verification
    VERIFIED("Verified", "Account verified, all features accessible"),
    
    REJECTED("Rejected", "Verification failed, documents invalid"),
    SUSPENDED("Suspended", "Temporarily blocked due to violations"),
    DELETED("Deleted", "Account soft deleted"), 
    PENDING_VERIFICATION(" " , " "),
    ;

    private final String displayName;
    private final String description;

    AccountStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}