package com.truckmitra.entity.common.enums;

public enum InvoicePaymentStatus {
    PENDING("Pending", "Payment has not been received yet"),
    PARTIALLY_PAID("Partially Paid", "Partial payment received"),
    PAID("Paid", "Full payment received"),
    OVERDUE("Overdue", "Payment is past the due date");

    private final String displayName;
    private final String description;

    InvoicePaymentStatus(String displayName, String description) {
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
