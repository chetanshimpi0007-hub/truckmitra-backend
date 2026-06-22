package com.truckmitra.service.impl;

import com.truckmitra.entity.common.SubscriptionPlan;
import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.entity.user.User;
import com.truckmitra.service.common.RazorpaySubscriptionService;
import com.razorpay.RazorpayClient;
import com.razorpay.Subscription;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class RazorpaySubscriptionServiceImpl implements RazorpaySubscriptionService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() {
        try {
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Razorpay Client", e);
        }
    }

    @Override
    public Subscription createSubscription(SubscriptionPlan plan, User user) {
        try {
            JSONObject options = new JSONObject();
            options.put("plan_id", plan.getRazorpayPlanId());
            options.put("total_count", "YEARLY".equalsIgnoreCase(plan.getBillingCycle()) ? 10 : 120);
            options.put("customer_notify", 1);
            
            JSONObject notes = new JSONObject();
            notes.put("userId", user.getId());
            notes.put("planId", plan.getId());
            options.put("notes", notes);

            return razorpayClient.subscriptions.create(options);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay subscription", e);
        }
    }

    @Override
    public Subscription cancelSubscription(String razorpaySubscriptionId) {
        try {
            return razorpayClient.subscriptions.cancel(razorpaySubscriptionId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to cancel Razorpay subscription", e);
        }
    }

    @Override
    public Subscription fetchSubscription(String razorpaySubscriptionId) {
        try {
            return razorpayClient.subscriptions.fetch(razorpaySubscriptionId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch Razorpay subscription", e);
        }
    }
}
