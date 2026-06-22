package com.truckmitra.controller;

import com.truckmitra.service.common.SubscriptionBillingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.razorpay.Utils;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@RestController
@RequestMapping("/api/subscription/webhook")
@RequiredArgsConstructor
@Slf4j
public class SubscriptionWebhookController {

    private final SubscriptionBillingService subscriptionBillingService;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            boolean isValid = Utils.verifyWebhookSignature(payload, signature, keySecret);
            if (!isValid) {
                return ResponseEntity.badRequest().body("Invalid signature");
            }

            JSONObject jsonPayload = new JSONObject(payload);
            String event = jsonPayload.getString("event");
            JSONObject payloadObj = jsonPayload.getJSONObject("payload");

            if ("subscription.activated".equals(event)) {
                JSONObject subscription = payloadObj.getJSONObject("subscription").getJSONObject("entity");
                subscriptionBillingService.handleSubscriptionActivated(subscription.getString("id"));
            } else if ("subscription.charged".equals(event)) {
                JSONObject subscription = payloadObj.getJSONObject("subscription").getJSONObject("entity");
                JSONObject payment = payloadObj.getJSONObject("payment").getJSONObject("entity");
                subscriptionBillingService.handleSubscriptionCharged(
                        subscription.getString("id"),
                        payment.getString("id"),
                        payment.getDouble("amount") / 100.0,
                        payment.getString("currency"),
                        signature
                );
            } else if ("subscription.cancelled".equals(event)) {
                JSONObject subscription = payloadObj.getJSONObject("subscription").getJSONObject("entity");
                subscriptionBillingService.handleSubscriptionCancelled(subscription.getString("id"));
            } else if ("payment.failed".equals(event)) {
                JSONObject payment = payloadObj.getJSONObject("payment").getJSONObject("entity");
                String subId = null;
                // Safely extract subscription id if it's there
                if (payment.has("subscription_id") && !payment.isNull("subscription_id")) {
                    subId = payment.getString("subscription_id");
                    subscriptionBillingService.handlePaymentFailed(
                            subId,
                            payment.getString("id"),
                            payment.getDouble("amount") / 100.0,
                            payment.getString("currency")
                    );
                }
            }
            
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            return ResponseEntity.internalServerError().body("Error processing webhook");
        }
    }
}
