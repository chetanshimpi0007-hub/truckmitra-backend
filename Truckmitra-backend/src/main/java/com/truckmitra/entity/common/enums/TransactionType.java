// src/main/java/com/truckmitra/entity/common/enums/TransactionType.java
package com.truckmitra.entity.common.enums;

public enum TransactionType {
    // Credit (Money In)
    TRIP_EARNINGS("Trip Earnings", "Payment received for completed trip"),
    ADVANCE_PAYMENT("Advance Payment", "Advance given before loading"),
    WALLET_RECHARGE("Wallet Recharge", "Money added to wallet"),
    BONUS("Bonus", "Incentive or reward"),
    REFUND("Refund", "Money refunded"),

    // Debit (Money Out)
    TRIP_PAYMENT("Trip Payment", "Payment made for trip"),
    WITHDRAWAL("Withdrawal", "Transfer to bank account"),
    COMMISSION("Commission", "Platform fee deducted"),
    PENALTY("Penalty", "Fine for violation"),
    BID_FEE("Bid Fee", "Fee for bidding on load"),
    ESCROW_HOLD("Escrow Hold", "Amount held in escrow"),
    ESCROW_RELEASE("Escrow Release", "Amount released from escrow");

    private final String displayName;
    private final String description;

    TransactionType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public boolean isCredit() {
        return this == TRIP_EARNINGS || this == ADVANCE_PAYMENT || 
               this == WALLET_RECHARGE || this == BONUS || this == REFUND;
    }

    public boolean isDebit() {
        return this == TRIP_PAYMENT || this == WITHDRAWAL || 
               this == COMMISSION || this == PENALTY || this == BID_FEE;
    }
}