// src/main/java/com/truckmitra/exception/InsufficientBalanceException.java
package com.truckmitra.exception;

import java.math.BigDecimal;

public class InsufficientBalanceException extends RuntimeException {
    
    private final BigDecimal requiredAmount;
    private final BigDecimal availableAmount;
    private final Long userId;

    public InsufficientBalanceException(String message) {
        super(message);
        this.requiredAmount = null;
        this.availableAmount = null;
        this.userId = null;
    }

    public InsufficientBalanceException(Long userId, BigDecimal required, BigDecimal available) {
        super(String.format("Insufficient balance for user: %d. Required: ₹%s, Available: ₹%s", 
              userId, required, available));
        this.userId = userId;
        this.requiredAmount = required;
        this.availableAmount = available;
    }

    public BigDecimal getRequiredAmount() {
        return requiredAmount;
    }

    public BigDecimal getAvailableAmount() {
        return availableAmount;
    }

    public Long getUserId() {
        return userId;
    }
}