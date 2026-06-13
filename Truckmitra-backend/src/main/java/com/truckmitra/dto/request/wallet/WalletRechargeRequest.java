// src/main/java/com/truckmitra/dto/request/wallet/WalletRechargeRequest.java
package com.truckmitra.dto.request.wallet;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record WalletRechargeRequest(
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Amount must be at least ₹1")
    BigDecimal amount,

    @NotBlank(message = "Payment method is required")
    String paymentMethod, // UPI, CARD, NET_BANKING

    String paymentGateway, // RAZORPAY, CASHFREE

    @NotBlank(message = "User role is required")
    String userRole
) {}