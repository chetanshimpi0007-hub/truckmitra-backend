// src/main/java/com/truckmitra/dto/request/wallet/EscrowRequest.java
package com.truckmitra.dto.request.wallet;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record EscrowRequest(
    @NotNull(message = "Trip ID is required")
    Long tripId,

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Amount must be at least ₹1")
    BigDecimal amount,

    @NotNull(message = "Action is required")
    String action // HOLD, RELEASE, REFUND
) {}