// src/main/java/com/truckmitra/dto/response/wallet/TransactionResponse.java
package com.truckmitra.dto.response.wallet;

import com.truckmitra.entity.common.enums.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
    String transactionId,
    TransactionType transactionType,
    BigDecimal amount,
    BigDecimal currentBalance,
    String direction,
    String status,
    LocalDateTime transactionDate,
    String paymentMethod,
    String description,
    Long tripId,
    String failureReason
) {}