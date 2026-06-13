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
    private String name; // FREE, BASIC, PRO, ENTERPRISE

    private String description;

    private Double price; // Monthly price

    private Integer loadPostLimit; // for Shippers
    
    private Integer bidLimit; // for Transporters

    private Integer fleetLimit; // Max vehicles/drivers

    private Boolean hasAnalytics;

    private Boolean hasVoiceAssistant;

    @ElementCollection
    @Builder.Default
    private List<String> features = new ArrayList<>();
}
