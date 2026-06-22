package com.truckmitra.controller;

import com.truckmitra.dto.admin.AdminAnalyticsDTOs.*;
import com.truckmitra.service.admin.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<OverviewDTO> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverview());
    }

    @GetMapping("/users")
    public ResponseEntity<UsersAnalyticsDTO> getUsers() {
        return ResponseEntity.ok(analyticsService.getUsersAnalytics());
    }

    @GetMapping("/revenue")
    public ResponseEntity<RevenueAnalyticsDTO> getRevenue() {
        return ResponseEntity.ok(analyticsService.getRevenueAnalytics());
    }

    @GetMapping("/loads")
    public ResponseEntity<LoadsAnalyticsDTO> getLoads() {
        return ResponseEntity.ok(analyticsService.getLoadsAnalytics());
    }

    @GetMapping("/trips")
    public ResponseEntity<TripsAnalyticsDTO> getTrips() {
        return ResponseEntity.ok(analyticsService.getTripsAnalytics());
    }

    @GetMapping("/wallet")
    public ResponseEntity<WalletAnalyticsDTO> getWallet() {
        return ResponseEntity.ok(analyticsService.getWalletAnalytics());
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<SubscriptionAnalyticsDTO> getSubscriptions() {
        return ResponseEntity.ok(analyticsService.getSubscriptionAnalytics());
    }

    @GetMapping("/push-notifications")
    public ResponseEntity<PushNotificationAnalyticsDTO> getPushNotifications() {
        return ResponseEntity.ok(analyticsService.getPushNotificationAnalytics());
    }

    @GetMapping("/ai")
    public ResponseEntity<AIMatchingAnalyticsDTO> getAIMatching() {
        return ResponseEntity.ok(analyticsService.getAIMatchingAnalytics());
    }
}
