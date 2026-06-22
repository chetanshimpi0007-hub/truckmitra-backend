package com.truckmitra.entity.common;

import jakarta.persistence.Column;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // FREE, STARTER_MONTHLY, STARTER_YEARLY, PREMIUM_MONTHLY, PREMIUM_YEARLY, ENTERPRISE_MONTHLY, ENTERPRISE_YEARLY

    private String description;

    private Double price;

    @Column(name = "billing_cycle")
    private String billingCycle; // MONTHLY, YEARLY

    @Column(name = "razorpay_plan_id")
    private String razorpayPlanId;

    @Column(name = "loadpostlimit")
    private Integer maxLoads;
    
    @Column(name = "bidlimit")
    private Integer maxBids;

    @Column(name = "fleetlimit")
    private Integer maxVehicles;

    @Column(name = "max_drivers")
    private Integer maxDrivers;

    @Builder.Default
    private Boolean active = true;

    @Column(name = "hasanalytics")
    private Boolean hasAnalytics;

    @Column(name = "hasvoiceassistant")
    private Boolean hasVoiceAssistant;

    @ElementCollection
    @Builder.Default
    private List<String> features = new ArrayList<>();
}
