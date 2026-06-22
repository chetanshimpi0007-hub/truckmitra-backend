package com.truckmitra.controller;

import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.wallet.WalletResponse;
import com.truckmitra.dto.response.wallet.TransactionResponse;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.service.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<WalletResponse>> getMyWallet(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found")));

        WalletResponse wallet;
        try {
            wallet = walletService.getWallet(user.getId(), user.getRole().name());
        } catch (com.truckmitra.exception.ResourceNotFoundException e) {
            wallet = walletService.createWallet(user.getId(), user.getRole().name());
        }
        return ResponseEntity.ok(ApiResponse.success("Wallet fetched successfully", wallet));
    }

    // Alias for frontend which expects /api/wallet/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<WalletResponse>> getMeWallet(@AuthenticationPrincipal UserDetails userDetails) {
        return getMyWallet(userDetails);
    }

    @GetMapping("/my/transactions")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getMyTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found")));

        Page<TransactionResponse> transactions = walletService.getTransactionHistory(user.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Transactions fetched successfully", transactions));
    }

    // Alias for frontend which may call /api/wallet/me/transactions
    @GetMapping("/me/transactions")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getMeTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return getMyTransactions(userDetails, page, size);
    }

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Object>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody java.util.Map<String, Object> payload) {
        
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found")));

        java.math.BigDecimal amount = new java.math.BigDecimal(payload.get("amount").toString());
        Object order = walletService.createRazorpayOrder(user.getId(), amount);
        
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", order));
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<ApiResponse<TransactionResponse>> verifyPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody java.util.Map<String, String> payload) {
        
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found")));

        String orderId = payload.get("razorpay_order_id");
        String paymentId = payload.get("razorpay_payment_id");
        String signature = payload.get("razorpay_signature");
        
        TransactionResponse response = walletService.verifyRazorpayPayment(user.getId(), orderId, paymentId, signature);
        
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", response));
    }
}
