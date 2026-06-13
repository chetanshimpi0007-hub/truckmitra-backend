package com.truckmitra.controller.wallet;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.id}")
    private String RAZORPAY_KEY;
    
    @org.springframework.beans.factory.annotation.Value("${razorpay.key.secret}")
    private String RAZORPAY_SECRET;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            RazorpayClient client = new RazorpayClient(RAZORPAY_KEY, RAZORPAY_SECRET);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", Integer.parseInt(payload.get("amount").toString()) * 100); 
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + UUID.randomUUID().toString().substring(0,8));

            Order order = client.orders.create(orderRequest);

            Map<String, Object> response = Map.of(
                    "orderId", order.get("id"),
                    "amount", payload.get("amount"),
                    "currency", "INR",
                    "status", "created"
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating Razorpay order: {}", e.getMessage());
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not initiate payment. Please try again."));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, Object> payload) {
        String razorpayOrderId = payload.get("razorpay_order_id").toString();
        String razorpayPaymentId = payload.get("razorpay_payment_id").toString();
        String razorpaySignature = payload.get("razorpay_signature").toString();

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValid = com.razorpay.Utils.verifyPaymentSignature(options, RAZORPAY_SECRET);

            if (isValid) {
                // Here we would call walletService.topUp(userId, amount)
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "Payment verified and wallet topped up successfully."
                ));
            } else {
                return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "failed", "message", "Invalid payment signature."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Verification failed."));
        }
    }
}
