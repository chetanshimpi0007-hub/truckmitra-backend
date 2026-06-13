// src/main/java/com/truckmitra/entity/common/enums/PaymentStatus.java
package com.truckmitra.entity.common.enums;

public enum PaymentStatus {
    PENDING("Pending", "Payment not yet initiated"),
    HELD("Held in Escrow", "Amount deducted from shipper, held by platform"),
    RELEASED("Released", "Payment released to transporter"),
    REFUNDED("Refunded", "Amount refunded to shipper"),
    FAILED("Failed", "Transaction failed");

    private final String displayName;
    private final String description;

    PaymentStatus(String displayName, String description) {
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