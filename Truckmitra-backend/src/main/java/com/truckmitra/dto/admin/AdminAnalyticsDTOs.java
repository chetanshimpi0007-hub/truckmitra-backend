package com.truckmitra.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class AdminAnalyticsDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartPoint {
        private String name;
        private Number value;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverviewDTO {
        private long totalUsers;
        private long totalShippers;
        private long totalTransporters;
        private long totalDrivers;
        private long activeLoads;
        private long completedTrips;
        private double totalRevenue;
        private long walletTransactionsCount;
        private long activeSubscriptions;
        private double monthlyGrowthPercent;
        private long pendingDeliveries;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsersAnalyticsDTO {
        private List<ChartPoint> registrationsChart;
        private List<Object> recentUsers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueAnalyticsDTO {
        private List<ChartPoint> revenueChart;
        private List<Object> recentTransactions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoadsAnalyticsDTO {
        private List<ChartPoint> loadTrendsChart;
        private List<ChartPoint> loadStatusDistribution;
        private List<Object> recentLoads;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TripsAnalyticsDTO {
        private List<ChartPoint> tripTrendsChart;
        private List<Object> recentTrips;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WalletAnalyticsDTO {
        private double totalWalletBalance;
        private List<ChartPoint> walletTrendsChart;
        private List<Object> recentTransactions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubscriptionAnalyticsDTO {
        private long activeSubscriptions;
        private long cancelledSubscriptions;
        private long failedPayments;
        private double mrr;   // Monthly Recurring Revenue
        private double arr;   // Annual Recurring Revenue
        private List<ChartPoint> revenueTrendsChart;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PushNotificationAnalyticsDTO {
        private long registeredDevices;
        private long totalDelivered;
        private long totalFailed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AIMatchingAnalyticsDTO {
        private double matchSuccessRate;
        private double acceptanceRate;
        private List<ChartPoint> topRoutes;
        private List<ChartPoint> mostMatchedCities;
        private double averageScore;
        private List<ChartPoint> mostActiveTransporters;
    }
}
