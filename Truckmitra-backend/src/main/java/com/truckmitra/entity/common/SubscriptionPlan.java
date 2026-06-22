package com.truckmitra.entity.common;

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

    private String billingCycle; // MONTHLY, YEARLY

    private String razorpayPlanId;

    private Integer maxLoads;
    
    private Integer maxBids;

    private Integer maxVehicles;

    private Integer maxDrivers;

    @Builder.Default
    private Boolean active = true;

    private Boolean hasAnalytics;

    private Boolean hasVoiceAssistant;

    @ElementCollection
    @Builder.Default
    private List<String> features = new ArrayList<>();
}
