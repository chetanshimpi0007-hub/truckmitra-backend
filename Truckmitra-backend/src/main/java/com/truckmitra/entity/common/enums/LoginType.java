// src/main/java/com/truckmitra/entity/common/enums/LoginType.java
package com.truckmitra.entity.common.enums;

public enum LoginType {
    EMAIL_PASSWORD("email", "Email and Password login"),
    PHONE_OTP("otp", "Phone number with OTP verification"),
    GOOGLE("google", "Google OAuth2 login"),
	FACEBOOK("facebook" , "Facebook OAuth2 login");

    private final String type;
    private final String description;

    LoginType(String type, String description) {
        this.type = type;
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public static LoginType fromString(String type) {
        for (LoginType lt : LoginType.values()) {
            if (lt.type.equalsIgnoreCase(type)) {
                return lt;
            }
        }
        return EMAIL_PASSWORD; // default
    }
}