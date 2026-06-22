// src/main/java/com/truckmitra/service/wallet/WalletService.java
package com.truckmitra.service.wallet;

import com.truckmitra.dto.request.wallet.EscrowRequest;
import com.truckmitra.dto.request.wallet.WalletRechargeRequest;
import com.truckmitra.dto.request.wallet.WithdrawalRequest;
import com.truckmitra.dto.response.wallet.TransactionResponse;
import com.truckmitra.dto.response.wallet.WalletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface WalletService {

    // Wallet management
    WalletResponse createWallet(Long userId, String userRole);

    WalletResponse getWallet(Long userId, String userRole);

    WalletResponse getWalletByNumber(String walletNumber);

    // Transactions
    TransactionResponse rechargeWallet(Long userId, WalletRechargeRequest request);

    TransactionResponse withdrawFromWallet(Long userId, WithdrawalRequest request);

    TransactionResponse holdInEscrow(Long userId, EscrowRequest request);

    TransactionResponse releaseFromEscrow(Long userId, EscrowRequest request);

    TransactionResponse transferToBank(Long userId, WithdrawalRequest request);

    // Trip payments
    TransactionResponse processTripPayment(Long shipperId, Long transporterId, 
                                           Long tripId, BigDecimal amount);

    TransactionResponse payDriverAdvance(Long transporterId, Long driverId, 
                                         Long tripId, BigDecimal amount);

    TransactionResponse settleTripEarnings(Long driverId, Long tripId, BigDecimal amount);

    // History and queries
    Page<TransactionResponse> getTransactionHistory(Long userId, Pageable pageable);

    Page<TransactionResponse> getWalletTransactions(Long walletId, Pageable pageable);

    Page<TransactionResponse> getAllTransactions(Pageable pageable);

    TransactionResponse getTransaction(String transactionId);

    BigDecimal getBalance(Long userId, String userRole);

    // Validation
    boolean hasSufficientBalance(Long userId, String userRole, BigDecimal amount);

    void validateWalletPin(Long userId, String userRole, String pin);

    TransactionResponse creditWallet(Long userId, BigDecimal amount, String description);

    // Razorpay Integration
    Object createRazorpayOrder(Long userId, BigDecimal amount);
    
    TransactionResponse verifyRazorpayPayment(Long userId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature);
}