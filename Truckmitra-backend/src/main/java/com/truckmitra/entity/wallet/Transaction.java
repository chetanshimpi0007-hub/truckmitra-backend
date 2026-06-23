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

    @Column(name = "transactionid", nullable = false, unique = true, length = 30)
    private String transactionId; // Format: TXN-YYYYMMDD-XXXXXXXX

    @Column(name = "walletid", nullable = false)
    private Long walletId;

    @Column(name = "userid", nullable = false)
    private Long userId;

    @Column(name = "userrole", length = 20)
    private String userRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "transactiontype", nullable = false, length = 30)
    private TransactionType transactionType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "currentbalance", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentBalance; // Balance after transaction

    @Column(nullable = false, length = 10)
    private String direction; // CREDIT or DEBIT

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, SUCCESS, FAILED, REVERSED

    @Column(name = "transactiondate", nullable = false)
    private LocalDateTime transactionDate;

    // Payment method details
    @Column(name = "paymentmethod")
    private String paymentMethod; // UPI, CARD, NET_BANKING, WALLET, BANK_TRANSFER

    @Column(name = "paymentgateway")
    private String paymentGateway; // RAZORPAY, STRIPE, CASHFREE, etc.

    @Column(name = "gatewaytransactionid")
    private String gatewayTransactionId; // Reference from payment gateway

    @Column(name = "bankreferencenumber")
    private String bankReferenceNumber;

    @Column(name = "upitransactionid")
    private String upiTransactionId;

    // For internal transfers
    @Column(name = "fromwalletid")
    private Long fromWalletId;

    @Column(name = "towalletid")
    private Long toWalletId;

    @Column(name = "fromuserid")
    private Long fromUserId;

    @Column(name = "touserid")
    private Long toUserId;

    // Trip related
    @Column(name = "tripid")
    private Long tripId;

    @Column(name = "loadid")
    private Long loadId;

    @Column(name = "bidid")
    private Long bidId;

    // Additional details
    @Column(length = 500)
    private String description;

    private String remarks;

    // Failure handling
    @Column(name = "failurereason")
    private String failureReason;

    @Column(name = "retrycount")
    private Integer retryCount = 0;

    @Column(name = "settledat")
    private LocalDateTime settledAt;

    // For reversals
    @Column(name = "reversedtransactionid")
    private Long reversedTransactionId;

    @Column(name = "reversalreason")
    private String reversalReason;

    // Audit
    @Column(name = "initiatedby")
    private String initiatedBy; // USER, SYSTEM, ADMIN

    @Column(name = "approvedby")
    private Long approvedBy; // Admin ID if manual approval

    @Column(name = "approvedat")
    private LocalDateTime approvedAt;

    // Metadata
    @Column(name = "ipaddress")
    private String ipAddress;

    @Column(name = "useragent")
    private String userAgent;

    @Column(name = "requestpayload", length = 1000)
    private String requestPayload; // For debugging

    @Column(name = "responsepayload", length = 1000)
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