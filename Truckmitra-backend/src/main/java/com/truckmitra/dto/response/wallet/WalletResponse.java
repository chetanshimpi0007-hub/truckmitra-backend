// src/main/java/com/truckmitra/dto/response/wallet/WalletResponse.java
package com.truckmitra.dto.response.wallet;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WalletResponse(
    Long id,
    Long userId,
    String userRole,
    String walletNumber,
    BigDecimal currentBalance,
    BigDecimal escrowBalance,
    BigDecimal lifetimeEarnings,
    BigDecimal lifetimeSpent,
    String walletStatus,
    LocalDateTime lastTransactionAt,
    Integer dailyTransactionCount,
    Boolean isPinSet
) {}