package com.truckmitra.service.impl.wallet;

import com.truckmitra.dto.request.wallet.EscrowRequest;
import com.truckmitra.dto.request.wallet.WalletRechargeRequest;
import com.truckmitra.dto.request.wallet.WithdrawalRequest;
import com.truckmitra.dto.response.wallet.TransactionResponse;
import com.truckmitra.dto.response.wallet.WalletResponse;
import com.truckmitra.entity.common.enums.TransactionType;
import com.truckmitra.entity.wallet.Transaction;
import com.truckmitra.entity.wallet.Wallet;
import com.truckmitra.exception.ResourceNotFoundException;
import com.truckmitra.repository.wallet.TransactionRepository;
import com.truckmitra.repository.wallet.WalletRepository;
import com.truckmitra.service.wallet.WalletService;
import com.truckmitra.service.InAppNotificationService;
import com.truckmitra.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final InAppNotificationService notificationService;

    @Override
    @Transactional
    public WalletResponse createWallet(Long userId, String userRole) {
        if (walletRepository.findByUserIdAndUserRole(userId, userRole).isPresent()) {
            throw new RuntimeException("Wallet already exists for this user");
        }
        Wallet wallet = Wallet.builder()
                .userId(userId)
                .userRole(userRole)
                .walletNumber("WLT-" + System.currentTimeMillis())
                .currentBalance(BigDecimal.ZERO)
                .escrowBalance(BigDecimal.ZERO)
                .walletStatus("ACTIVE")
                .build();
        return mapToWalletResponse(walletRepository.save(wallet));
    }

    @Override
    public WalletResponse getWallet(Long userId, String userRole) {
        return walletRepository.findByUserIdAndUserRole(userId, userRole)
                .map(this::mapToWalletResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
    }

    @Override
    public WalletResponse getWalletByNumber(String walletNumber) {
        return walletRepository.findByWalletNumber(walletNumber)
                .map(this::mapToWalletResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
    }

    @Override
    @Transactional
    public TransactionResponse rechargeWallet(Long userId, WalletRechargeRequest request) {
        Wallet wallet = walletRepository.findByUserIdAndUserRoleWithLock(userId, "TRANSPORTER")
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        wallet.credit(request.amount());
        Transaction transaction = Transaction.builder()
                .walletId(wallet.getId())
                .userId(userId)
                .userRole("TRANSPORTER")
                .transactionType(TransactionType.WALLET_RECHARGE)
                .amount(request.amount())
                .currentBalance(wallet.getCurrentBalance())
                .direction("CREDIT")
                .status("SUCCESS")
                .transactionDate(LocalDateTime.now())
                .paymentMethod(request.paymentMethod())
                .description("Wallet recharge")
                .build();
        transactionRepository.save(transaction);
        walletRepository.save(wallet);
        return mapToTransactionResponse(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse withdrawFromWallet(Long userId, WithdrawalRequest request) {
        Wallet wallet = walletRepository.findByUserIdAndUserRoleWithLock(userId, "TRANSPORTER")
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        if (wallet.getCurrentBalance().compareTo(request.amount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        wallet.debit(request.amount());
        Transaction transaction = Transaction.builder()
                .walletId(wallet.getId())
                .userId(userId)
                .userRole("TRANSPORTER")
                .transactionType(TransactionType.WITHDRAWAL)
                .amount(request.amount())
                .currentBalance(wallet.getCurrentBalance())
                .direction("DEBIT")
                .status("SUCCESS")
                .transactionDate(LocalDateTime.now())
                .description("Wallet withdrawal to bank")
                .build();
        transactionRepository.save(transaction);
        walletRepository.save(wallet);
        return mapToTransactionResponse(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse holdInEscrow(Long userId, EscrowRequest request) {
        Wallet wallet = walletRepository.findByUserIdAndUserRoleWithLock(userId, "SHIPPER")
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        if (wallet.getCurrentBalance().compareTo(request.amount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        wallet.holdInEscrow(request.amount());
        Transaction transaction = Transaction.builder()
                .walletId(wallet.getId())
                .userId(userId)
                .userRole("SHIPPER")
                .transactionType(TransactionType.ESCROW_HOLD)
                .amount(request.amount())
                .currentBalance(wallet.getCurrentBalance())
                .direction("DEBIT")
                .status("SUCCESS")
                .transactionDate(LocalDateTime.now())
                .tripId(request.tripId())
                .description("Escrow hold for trip")
                .build();
        transactionRepository.save(transaction);
        walletRepository.save(wallet);
        return mapToTransactionResponse(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse releaseFromEscrow(Long userId, EscrowRequest request) {
        Wallet wallet = walletRepository.findByUserIdAndUserRoleWithLock(userId, "SHIPPER")
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        wallet.releaseFromEscrow(request.amount());
        Transaction transaction = Transaction.builder()
                .walletId(wallet.getId())
                .userId(userId)
                .userRole("SHIPPER")
                .transactionType(TransactionType.ESCROW_RELEASE)
                .amount(request.amount())
                .currentBalance(wallet.getCurrentBalance())
                .direction("CREDIT")
                .status("SUCCESS")
                .transactionDate(LocalDateTime.now())
                .tripId(request.tripId())
                .description("Escrow release")
                .build();
        transactionRepository.save(transaction);
        walletRepository.save(wallet);
        return mapToTransactionResponse(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse transferToBank(Long userId, WithdrawalRequest request) {
        return withdrawFromWallet(userId, request);
    }

    @Override
    @Transactional
    public TransactionResponse processTripPayment(Long shipperId, Long transporterId, Long tripId, BigDecimal amount) {
        // Implementation for processing trip payment logic
        return null;
    }

    @Override
    @Transactional
    public TransactionResponse payDriverAdvance(Long transporterId, Long driverId, Long tripId, BigDecimal amount) {
        return null;
    }

    @Override
    @Transactional
    public TransactionResponse settleTripEarnings(Long driverId, Long tripId, BigDecimal amount) {
        return null;
    }

    @Override
    public Page<TransactionResponse> getTransactionHistory(Long userId, Pageable pageable) {
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId, pageable).map(this::mapToTransactionResponse);
    }

    @Override
    public Page<TransactionResponse> getWalletTransactions(Long walletId, Pageable pageable) {
        return transactionRepository.findByWalletIdOrderByTransactionDateDesc(walletId, pageable).map(this::mapToTransactionResponse);
    }

    @Override
    public Page<TransactionResponse> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(this::mapToTransactionResponse);
    }

    @Override
    public TransactionResponse getTransaction(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId)
                .map(this::mapToTransactionResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
    }

    @Override
    public BigDecimal getBalance(Long userId, String userRole) {
        return walletRepository.findByUserIdAndUserRole(userId, userRole)
                .map(Wallet::getCurrentBalance)
                .orElse(BigDecimal.ZERO);
    }

    @Override
    public boolean hasSufficientBalance(Long userId, String userRole, BigDecimal amount) {
        return getBalance(userId, userRole).compareTo(amount) >= 0;
    }

    @Override
    public void validateWalletPin(Long userId, String userRole, String pin) {
        // Pin validation logic
    }

    @Override
    @Transactional
    public TransactionResponse creditWallet(Long userId, BigDecimal amount, String description) {
        Wallet wallet = walletRepository.findByUserIdAndUserRoleWithLock(userId, "TRANSPORTER")
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        wallet.credit(amount);
        Transaction transaction = Transaction.builder()
                .walletId(wallet.getId())
                .userId(userId)
                .userRole("TRANSPORTER")
                .transactionType(TransactionType.TRIP_EARNINGS)
                .amount(amount)
                .currentBalance(wallet.getCurrentBalance())
                .direction("CREDIT")
                .status("SUCCESS")
                .transactionDate(LocalDateTime.now())
                .description(description)
                .build();
        transactionRepository.save(transaction);
        walletRepository.save(wallet);
        try {
            notificationService.sendNotification(userId, "Wallet Credited", "Your wallet has been credited with ₹" + amount, NotificationType.WALLET, wallet.getId());
        } catch (Exception e) {
            log.warn("Notification failed: {}", e.getMessage());
        }
        return mapToTransactionResponse(transaction);
    }

    @Override
    public Object createRazorpayOrder(Long userId, BigDecimal amount) {
        try {
            String keyId = System.getenv("RAZORPAY_KEY_ID");
            String keySecret = System.getenv("RAZORPAY_KEY_SECRET");
            if(keyId == null || keySecret == null) {
                log.error("Razorpay credentials not found in env vars.");
                throw new IllegalStateException("Payment Gateway is not configured. Razorpay keys are missing.");
            }
            com.razorpay.RazorpayClient razorpay = new com.razorpay.RazorpayClient(keyId, keySecret);
            org.json.JSONObject orderRequest = new org.json.JSONObject();
            orderRequest.put("amount", amount.multiply(new BigDecimal(100)).intValue()); // amount in the smallest currency unit
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
            
            com.razorpay.Order order = razorpay.orders.create(orderRequest);
            return order.toJson().toMap();
        } catch (Exception e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public TransactionResponse verifyRazorpayPayment(Long userId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String keyId = System.getenv("RAZORPAY_KEY_ID");
            String keySecret = System.getenv("RAZORPAY_KEY_SECRET");
            if(keyId == null || keySecret == null) {
                throw new IllegalStateException("Payment Gateway is not configured. Razorpay keys are missing.");
            }
            
            org.json.JSONObject options = new org.json.JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);
            
            boolean status = com.razorpay.Utils.verifyPaymentSignature(options, keySecret);
            if (!status) {
                throw new RuntimeException("Payment signature verification failed");
            }
            
            com.razorpay.RazorpayClient razorpay = new com.razorpay.RazorpayClient(keyId, keySecret);
            com.razorpay.Order order = razorpay.orders.fetch(razorpayOrderId);
            
            if (order == null || !order.has("amount")) {
                throw new RuntimeException("Invalid order or order amount missing");
            }

            int amountInPaise = order.get("amount");
            BigDecimal amount = new BigDecimal(amountInPaise).divide(new BigDecimal(100));
            
            WalletRechargeRequest req = new WalletRechargeRequest(amount, "Razorpay", "RAZORPAY", "TRANSPORTER");
            return rechargeWallet(userId, req);
            
        } catch (Exception e) {
            throw new RuntimeException("Error verifying payment: " + e.getMessage());
        }
    }

    private WalletResponse mapToWalletResponse(Wallet wallet) {
        return new WalletResponse(
            wallet.getId(),
            wallet.getUserId(),
            wallet.getUserRole(),
            wallet.getWalletNumber(),
            wallet.getCurrentBalance(),
            wallet.getEscrowBalance(),
            wallet.getLifetimeEarnings(),
            wallet.getLifetimeSpent(),
            wallet.getWalletStatus(),
            wallet.getLastTransactionAt(),
            wallet.getDailyTransactionCount(),
            wallet.getIsPinSet()
        );
    }

    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return new TransactionResponse(
            transaction.getTransactionId(),
            transaction.getTransactionType(),
            transaction.getAmount(),
            transaction.getCurrentBalance(),
            transaction.getDirection(),
            transaction.getStatus(),
            transaction.getTransactionDate(),
            transaction.getPaymentMethod(),
            transaction.getDescription(),
            transaction.getTripId(),
            transaction.getFailureReason()
        );
    }
}