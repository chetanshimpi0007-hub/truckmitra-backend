// src/main/java/com/truckmitra/entity/wallet/Transaction.java
package com.truckmitra.entity.wallet;

import jakarta.persistence.Column;
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

    @Column(name = "transaction_id", nullable = false, unique = true, length = 30)
    private String transactionId; // Format: TXN-YYYYMMDD-XXXXXXXX

    @Column(name = "wallet_id", nullable = false)
    private Long walletId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_role", length = 20)
    private String userRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private TransactionType transactionType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "current_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentBalance; // Balance after transaction

    @Column(nullable = false, length = 10)
    private String direction; // CREDIT or DEBIT

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, SUCCESS, FAILED, REVERSED

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    // Payment method details
    @Column(name = "payment_method")
    private String paymentMethod; // UPI, CARD, NET_BANKING, WALLET, BANK_TRANSFER

    @Column(name = "payment_gateway")
    private String paymentGateway; // RAZORPAY, STRIPE, CASHFREE, etc.

    @Column(name = "gateway_transaction_id")
    private String gatewayTransactionId; // Reference from payment gateway

    @Column(name = "bank_reference_number")
    private String bankReferenceNumber;

    @Column(name = "upi_transaction_id")
    private String upiTransactionId;

    // For internal transfers
    @Column(name = "from_wallet_id")
    private Long fromWalletId;

    @Column(name = "to_wallet_id")
    private Long toWalletId;

    @Column(name = "from_user_id")
    private Long fromUserId;

    @Column(name = "to_user_id")
    private Long toUserId;

    // Trip related
    @Column(name = "trip_id")
    private Long tripId;

    @Column(name = "load_id")
    private Long loadId;

    @Column(name = "bid_id")
    private Long bidId;

    // Additional details
    @Column(length = 500)
    private String description;

    private String remarks;

    // Failure handling
    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    // For reversals
    @Column(name = "reversed_transaction_id")
    private Long reversedTransactionId;

    @Column(name = "reversal_reason")
    private String reversalReason;

    // Audit
    @Column(name = "initiated_by")
    private String initiatedBy; // USER, SYSTEM, ADMIN

    @Column(name = "approved_by")
    private Long approvedBy; // Admin ID if manual approval

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    // Metadata
    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "request_payload", length = 1000)
    private String requestPayload; // For debugging

    @Column(name = "response_payload", length = 1000)
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