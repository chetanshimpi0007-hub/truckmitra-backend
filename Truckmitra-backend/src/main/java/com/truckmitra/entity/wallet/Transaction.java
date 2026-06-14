// src/main/java/com/truckmitra/entity/wallet/Transaction.java
package com.truckmitra.entity.wallet;

import com.truckmitra.entity.common.BaseEntity;
import com.truckmitra.entity.common.enums.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions",
       indexes = {
           @Index(name = "idx_wallet_id", columnList = "walletId"),
           @Index(name = "idx_tx_user_id", columnList = "userId"),
           @Index(name = "idx_trip_id", columnList = "tripId"),
           @Index(name = "idx_transaction_date", columnList = "transactionDate"),
           @Index(name = "idx_transaction_type", columnList = "transactionType"),
           @Index(name = "idx_transaction_status", columnList = "status")
       })
public class Transaction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String transactionId; // Format: TXN-YYYYMMDD-XXXXXXXX

    @Column(nullable = false)
    private Long walletId;

    @Column(nullable = false)
    private Long userId;

    @Column(length = 20)
    private String userRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TransactionType transactionType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal currentBalance; // Balance after transaction

    @Column(nullable = false, length = 10)
    private String direction; // CREDIT or DEBIT

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, SUCCESS, FAILED, REVERSED

    @Column(nullable = false)
    private LocalDateTime transactionDate;

    // Payment method details
    private String paymentMethod; // UPI, CARD, NET_BANKING, WALLET, BANK_TRANSFER

    private String paymentGateway; // RAZORPAY, STRIPE, CASHFREE, etc.

    private String gatewayTransactionId; // Reference from payment gateway

    private String bankReferenceNumber;

    private String upiTransactionId;

    // For internal transfers
    private Long fromWalletId;

    private Long toWalletId;

    private Long fromUserId;

    private Long toUserId;

    // Trip related
    private Long tripId;

    private Long loadId;

    private Long bidId;

    // Additional details
    @Column(length = 500)
    private String description;

    private String remarks;

    // Failure handling
    private String failureReason;

    private Integer retryCount = 0;

    private LocalDateTime settledAt;

    // For reversals
    private Long reversedTransactionId;

    private String reversalReason;

    // Audit
    private String initiatedBy; // USER, SYSTEM, ADMIN

    private Long approvedBy; // Admin ID if manual approval

    private LocalDateTime approvedAt;

    // Metadata
    private String ipAddress;

    private String userAgent;

    @Column(length = 1000)
    private String requestPayload; // For debugging

    @Column(length = 1000)
    private String responsePayload; // From payment gateway

    // Business methods
    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
        if (transactionId == null) {
            transactionId = generateTransactionId();
        }
    }

    private String generateTransactionId() {
        return "TXN-" + java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd-HHmm")
                .format(LocalDateTime.now()) + "-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public boolean isSuccess() {
        return "SUCCESS".equals(this.status);
    }

    public boolean isPending() {
        return "PENDING".equals(this.status);
    }

    public boolean isFailed() {
        return "FAILED".equals(this.status);
    }

    public void markSuccess() {
        this.status = "SUCCESS";
        this.settledAt = LocalDateTime.now();
    }

    public void markFailed(String reason) {
        this.status = "FAILED";
        this.failureReason = reason;
    }

    public void markReversed(String reason, Long reversedTxnId) {
        this.status = "REVERSED";
        this.reversalReason = reason;
        this.reversedTransactionId = reversedTxnId;
    }
}