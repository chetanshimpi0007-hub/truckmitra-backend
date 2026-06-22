package com.truckmitra.service.impl;

import com.truckmitra.entity.common.SubscriptionHistory;
import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.enums.NotificationType;
import com.truckmitra.repository.common.SubscriptionHistoryRepository;
import com.truckmitra.repository.common.UserSubscriptionRepository;
import com.truckmitra.service.NotificationService;
import com.truckmitra.service.common.SubscriptionBillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SubscriptionBillingServiceImpl implements SubscriptionBillingService {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final SubscriptionHistoryRepository historyRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void handleSubscriptionActivated(String subscriptionId) {
        UserSubscription sub = userSubscriptionRepository.findByRazorpaySubscriptionId(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found: " + subscriptionId));

        sub.setStatus("ACTIVE");
        sub.setStartDate(LocalDateTime.now());
        userSubscriptionRepository.save(sub);

        SubscriptionHistory history = SubscriptionHistory.builder()
                .user(sub.getUser())
                .plan(sub.getPlan())
                .razorpaySubscriptionId(subscriptionId)
                .eventType("ACTIVATED")
                .status("SUCCESS")
                .createdAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);

        notificationService.sendNotification(
                sub.getUser(),
                "Subscription Activated",
                "Your subscription to " + sub.getPlan().getName().replace("_", " ") + " is now active.",
                NotificationType.SUBSCRIPTION
        );
    }

    @Override
    @Transactional
    public void handleSubscriptionCharged(String subscriptionId, String paymentId, Double amount, String currency, String signature) {
        UserSubscription sub = userSubscriptionRepository.findByRazorpaySubscriptionId(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found: " + subscriptionId));

        sub.setStatus("ACTIVE");
        userSubscriptionRepository.save(sub);

        SubscriptionHistory history = SubscriptionHistory.builder()
                .user(sub.getUser())
                .plan(sub.getPlan())
                .razorpaySubscriptionId(subscriptionId)
                .razorpayPaymentId(paymentId)
                .razorpaySignature(signature)
                .amount(amount)
                .currency(currency)
                .eventType("CHARGED")
                .status("SUCCESS")
                .createdAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);

        notificationService.sendNotification(
                sub.getUser(),
                "Payment Successful",
                "Payment of " + currency + " " + amount + " for your subscription was successful.",
                NotificationType.SUBSCRIPTION
        );
    }

    @Override
    @Transactional
    public void handleSubscriptionCancelled(String subscriptionId) {
        UserSubscription sub = userSubscriptionRepository.findByRazorpaySubscriptionId(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found: " + subscriptionId));

        sub.setStatus("CANCELLED");
        sub.setAutoRenew(false);
        userSubscriptionRepository.save(sub);

        SubscriptionHistory history = SubscriptionHistory.builder()
                .user(sub.getUser())
                .plan(sub.getPlan())
                .razorpaySubscriptionId(subscriptionId)
                .eventType("CANCELLED")
                .status("SUCCESS")
                .createdAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);

        notificationService.sendNotification(
                sub.getUser(),
                "Subscription Cancelled",
                "Your subscription has been cancelled. You can re-subscribe at any time.",
                NotificationType.SUBSCRIPTION
        );
    }

    @Override
    @Transactional
    public void handlePaymentFailed(String subscriptionId, String paymentId, Double amount, String currency) {
        UserSubscription sub = userSubscriptionRepository.findByRazorpaySubscriptionId(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found: " + subscriptionId));

        SubscriptionHistory history = SubscriptionHistory.builder()
                .user(sub.getUser())
                .plan(sub.getPlan())
                .razorpaySubscriptionId(subscriptionId)
                .razorpayPaymentId(paymentId)
                .amount(amount)
                .currency(currency)
                .eventType("CHARGED")
                .status("FAILED")
                .createdAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);

        notificationService.sendNotification(
                sub.getUser(),
                "Payment Failed",
                "Payment of " + currency + " " + amount + " for your subscription failed. Please update your payment method.",
                NotificationType.SUBSCRIPTION
        );
    }
}
