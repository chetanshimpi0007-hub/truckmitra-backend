// src/main/java/com/truckmitra/entity/wallet/Wallet.java
package com.truckmitra.entity.wallet;

import jakarta.persistence.Column;
import com.truckmitra.entity.common.BaseEntity;
import com.truckmitra.entity.common.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Table(name = "wallets",
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_user_wallet", columnNames = {"userId", "userRole"})
       },
       indexes = {
           @Index(name = "idx_wallet_user_id", columnList = "userId"),
           @Index(name = "idx_wallet_status", columnList = "walletStatus")
       })
public class Wallet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userid", nullable = false)
    private Long userId; // User ki ID (Driver, Shipper, Transporter)

    @Column(name = "userrole", nullable = false, length = 20)
    private String userRole; // DRIVER, SHIPPER, TRANSPORTER

    @Column(name = "walletnumber", nullable = false, unique = true, length = 20)
    private String walletNumber; // Unique wallet number (e.g., WAL-2024-00001)

    @Builder.Default
    @Column(name = "currentbalance", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentBalance = BigDecimal.ZERO; // Available balance

    @Builder.Default
    @Column(name = "escrowbalance", nullable = false, precision = 15, scale = 2)
    private BigDecimal escrowBalance = BigDecimal.ZERO; // Held balance (for ongoing trips)

    @Builder.Default
    @Column(name = "lifetimedeposit", nullable = false, precision = 15, scale = 2)
    private BigDecimal lifetimeDeposit = BigDecimal.ZERO; // Total money added

    @Builder.Default
    @Column(name = "lifetimewithdrawal", nullable = false, precision = 15, scale = 2)
    private BigDecimal lifetimeWithdrawal = BigDecimal.ZERO; // Total money withdrawn

    @Builder.Default
    @Column(name = "lifetimeearnings", nullable = false, precision = 15, scale = 2)
    private BigDecimal lifetimeEarnings = BigDecimal.ZERO; // Total trip earnings

    @Builder.Default
    @Column(name = "lifetimespent", nullable = false, precision = 15, scale = 2)
    private BigDecimal lifetimeSpent = BigDecimal.ZERO; // Total money spent

    @Builder.Default
    @Column(name = "walletstatus", nullable = false, length = 20)
    private String walletStatus = "ACTIVE"; // ACTIVE, FROZEN, CLOSED

    @Column(name = "lasttransactionat")
    private LocalDateTime lastTransactionAt;

    @Column(name = "dailytransactioncount")
    @Builder.Default
    private Integer dailyTransactionCount = 0;

    @Column(name = "dailytransactionlimit")
    @Builder.Default
    private BigDecimal dailyTransactionLimit = new BigDecimal("100000"); // ₹1,00,000 default

    @Column(name = "pertransactionlimit")
    @Builder.Default
    private BigDecimal perTransactionLimit = new BigDecimal("50000"); // ₹50,000 default

    // Security fields
    @Column(name = "walletpin")
    private String walletPin; // For transactions (encrypted)

    @Column(name = "ispinset")
    @Builder.Default
    private Boolean isPinSet = false;

    @Column(name = "failedpinattempts")
    @Builder.Default
    private Integer failedPinAttempts = 0;

    @Column(name = "pinlockuntil")
    private LocalDateTime pinLockUntil;

    @Column(length = 500)
    private String remarks;

    // Business methods
    public boolean hasSufficientBalance(BigDecimal amount) {
        return currentBalance.compareTo(amount) >= 0;
    }

    public boolean hasSufficientEscrowBalance(BigDecimal amount) {
        return escrowBalance.compareTo(amount) >= 0;
    }

    public void credit(BigDecimal amount) {
        this.currentBalance = this.currentBalance.add(amount);
        this.lifetimeEarnings = this.lifetimeEarnings.add(amount);
        this.lastTransactionAt = LocalDateTime.now();
    }

    public void debit(BigDecimal amount) {
        if (!hasSufficientBalance(amount)) {
            throw new IllegalStateException("Insufficient balance");
        }
        this.currentBalance = this.currentBalance.subtract(amount);
        this.lifetimeSpent = this.lifetimeSpent.add(amount);
        this.lastTransactionAt = LocalDateTime.now();
    }

    public void holdInEscrow(BigDecimal amount) {
        if (!hasSufficientBalance(amount)) {
            throw new IllegalStateException("Insufficient balance to hold in escrow");
        }
        this.currentBalance = this.currentBalance.subtract(amount);
        this.escrowBalance = this.escrowBalance.add(amount);
        this.lastTransactionAt = LocalDateTime.now();
    }

    public void releaseFromEscrow(BigDecimal amount) {
        if (!hasSufficientEscrowBalance(amount)) {
            throw new IllegalStateException("Insufficient escrow balance");
        }
        this.escrowBalance = this.escrowBalance.subtract(amount);
        this.lifetimeSpent = this.lifetimeSpent.add(amount);
        this.lastTransactionAt = LocalDateTime.now();
    }

    public void addToWallet(BigDecimal amount) {
        this.currentBalance = this.currentBalance.add(amount);
        this.lifetimeDeposit = this.lifetimeDeposit.add(amount);
        this.lastTransactionAt = LocalDateTime.now();
    }

    public void withdraw(BigDecimal amount) {
        if (!hasSufficientBalance(amount)) {
            throw new IllegalStateException("Insufficient balance for withdrawal");
        }
        this.currentBalance = this.currentBalance.subtract(amount);
        this.lifetimeWithdrawal = this.lifetimeWithdrawal.add(amount);
        this.lastTransactionAt = LocalDateTime.now();
    }

    public void incrementTransactionCount() {
        this.dailyTransactionCount = this.dailyTransactionCount + 1;
        // Reset if last transaction was on different day
        if (lastTransactionAt != null && 
            !lastTransactionAt.toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
            this.dailyTransactionCount = 1;
        }
    }

    public boolean canTransact(BigDecimal amount) {
        if (walletStatus.equals("FROZEN")) {
            return false;
        }
        if (dailyTransactionCount >= 50) { // Max 50 transactions per day
            return false;
        }
        if (amount.compareTo(perTransactionLimit) > 0) {
            return false;
        }
        return true;
    }

    public void validatePin(String inputPin) {
        if (pinLockUntil != null && pinLockUntil.isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("Wallet PIN is locked. Try after: " + pinLockUntil);
        }
        
        if (!walletPin.equals(inputPin)) { // In real world, compare encrypted values
            this.failedPinAttempts++;
            if (this.failedPinAttempts >= 3) {
                this.pinLockUntil = LocalDateTime.now().plusHours(24);
            }
            throw new IllegalArgumentException("Invalid wallet PIN");
        }
        
        // Reset on success
        this.failedPinAttempts = 0;
        this.pinLockUntil = null;
    }
}