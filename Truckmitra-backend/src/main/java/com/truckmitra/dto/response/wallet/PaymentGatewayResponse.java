// src/main/java/com/truckmitra/dto/response/wallet/PaymentGatewayResponse.java
package com.truckmitra.dto.response.wallet;

public record PaymentGatewayResponse(
    boolean success,
    String gatewayTransactionId,
    String paymentId,
    String orderId,
    String signature,
    String redirectUrl,
    String errorMessage
) {}