// src/main/java/com/truckmitra/repository/wallet/TransactionRepository.java
package com.truckmitra.repository.wallet;

import com.truckmitra.entity.wallet.Transaction;
import com.truckmitra.entity.common.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionId(String transactionId);

    // User ke saare transactions
    Page<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId, Pageable pageable);

    // Wallet ke saare transactions
    Page<Transaction> findByWalletIdOrderByTransactionDateDesc(Long walletId, Pageable pageable);

    // Trip ke transactions
    List<Transaction> findByTripId(Long tripId);

    // Date range ke beech ke transactions
    List<Transaction> findByUserIdAndTransactionDateBetween(
        Long userId, LocalDateTime start, LocalDateTime end);

    // Transaction type ke hisaab se
    Page<Transaction> findByUserIdAndTransactionType(
        Long userId, TransactionType type, Pageable pageable);

    // Today's transactions count for user
    @Query(value = "SELECT COUNT(id) FROM transactions WHERE user_id = :userId " +
           "AND DATE(transaction_date) = CURRENT_DATE", nativeQuery = true)
    long countTodayTransactions(@Param("userId") Long userId);

    // Today's total amount for user
    @Query(value = "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = :userId " +
           "AND DATE(transaction_date) = CURRENT_DATE AND direction = :direction", nativeQuery = true)
    BigDecimal getTodayTotal(@Param("userId") Long userId, @Param("direction") String direction);

    // Pending transactions
    List<Transaction> findByStatus(String status);

    // Failed transactions for retry
    @Query("SELECT t FROM Transaction t WHERE t.status = 'FAILED' AND t.retryCount < 3")
    List<Transaction> findFailedTransactionsForRetry();

    // User ki total earnings
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId " +
           "AND t.transactionType IN ('TRIP_EARNINGS', 'ADVANCE_PAYMENT', 'BONUS') " +
           "AND t.status = 'SUCCESS'")
    BigDecimal getTotalEarnings(@Param("userId") Long userId);

    // User ki total spending
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId " +
           "AND t.transactionType IN ('TRIP_PAYMENT', 'WITHDRAWAL', 'COMMISSION', 'PENALTY') " +
           "AND t.status = 'SUCCESS'")
    BigDecimal getTotalSpending(@Param("userId") Long userId);
}