// src/main/java/com/truckmitra/enums/NotificationTemplate.java
package com.truckmitra.enums;

public enum NotificationTemplate {
    WELCOME_EMAIL("welcome-email"),
    LOGIN_OTP("login-otp"),
    TRIP_ASSIGNED("trip-assigned"),
    TRIP_ACCEPTED("trip-accepted"),
    TRIP_REJECTED("trip-rejected"),
    TRIP_COMPLETED("trip-completed"),
    PAYMENT_RECEIVED("payment-received"),
    PAYMENT_RELEASED("payment-released"),
    BID_RECEIVED("bid-received"),
    BID_ACCEPTED("bid-accepted"),
    BID_REJECTED("bid-rejected"),
    PASSWORD_RESET("password-reset"),
    WALLET_CREDITED("wallet-credited"),
    WALLET_DEBITED("wallet-debited"),
    NOTIFICATION("notification");  // Generic template for simple messages
    
    private final String templateName;
    
    NotificationTemplate(String templateName) {
        this.templateName = templateName;
    }
    
    public String getTemplateName() {
        return templateName;
    }
}