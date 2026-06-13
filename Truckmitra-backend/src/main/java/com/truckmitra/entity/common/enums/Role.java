// src/main/java/com/truckmitra/entity/common/enums/Role.java
package com.truckmitra.entity.common.enums;

public enum Role {
    ADMIN("Admin", "Full system access"),
    SHIPPER("Shipper", "Can post loads and manage shipments"),
    TRANSPORTER("Transporter", "Can bid on loads and manage fleet"),
    DRIVER("Driver", "Can accept and complete trips");

    private final String displayName;
    private final String description;

    Role(String displayName, String description) {
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