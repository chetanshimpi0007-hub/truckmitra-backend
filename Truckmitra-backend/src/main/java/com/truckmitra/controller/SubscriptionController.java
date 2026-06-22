package com.truckmitra.controller;

import com.truckmitra.dto.request.common.SubscriptionCreateRequestDTO;
import com.truckmitra.entity.common.SubscriptionHistory;
import com.truckmitra.entity.common.SubscriptionPlan;
import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.common.SubscriptionHistoryRepository;
import com.truckmitra.service.common.RazorpaySubscriptionService;
import com.truckmitra.service.common.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final RazorpaySubscriptionService razorpaySubscriptionService;
    private final SubscriptionHistoryRepository subscriptionHistoryRepository;

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @GetMapping("/current")
    public ResponseEntity<UserSubscription> getCurrentSubscription(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(subscriptionService.getCurrentSubscription(user));
    }

    @PostMapping("/create")
    public ResponseEntity<UserSubscription> createSubscription(@AuthenticationPrincipal User user,
                                                               @Valid @RequestBody SubscriptionCreateRequestDTO request) {
        return ResponseEntity.ok(subscriptionService.subscribe(user, request.getPlanId()));
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelSubscription(@AuthenticationPrincipal User user) {
        UserSubscription sub = subscriptionService.getCurrentSubscription(user);
        if (sub.getRazorpaySubscriptionId() != null) {
            razorpaySubscriptionService.cancelSubscription(sub.getRazorpaySubscriptionId());
        }
        return ResponseEntity.ok("Cancellation initiated");
    }

    @GetMapping("/history")
    public ResponseEntity<List<SubscriptionHistory>> getBillingHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(subscriptionHistoryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }
}
