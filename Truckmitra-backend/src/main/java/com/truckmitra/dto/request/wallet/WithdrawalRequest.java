// src/main/java/com/truckmitra/dto/request/wallet/WithdrawalRequest.java
package com.truckmitra.dto.request.wallet;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record WithdrawalRequest(
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "100.0", message = "Minimum withdrawal is ₹100")
    BigDecimal amount,

    @NotBlank(message = "Bank account details are required")
    String bankAccountNumber,

    String ifscCode,

    String accountHolderName,

    @NotBlank(message = "Wallet PIN is required")
    String walletPin
) {}