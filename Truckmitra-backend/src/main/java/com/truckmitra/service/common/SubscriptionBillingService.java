package com.truckmitra.service.common;

public interface SubscriptionBillingService {
    void handleSubscriptionActivated(String subscriptionId);
    void handleSubscriptionCharged(String subscriptionId, String paymentId, Double amount, String currency, String signature);
    void handleSubscriptionCancelled(String subscriptionId);
    void handlePaymentFailed(String subscriptionId, String paymentId, Double amount, String currency);
}
