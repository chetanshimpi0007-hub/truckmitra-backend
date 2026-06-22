package com.truckmitra.dto.response.common;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SubscriptionPlanDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String billingCycle;
    private String razorpayPlanId;
    private Integer maxLoads;
    private Integer maxBids;
    private Integer maxVehicles;
    private Integer maxDrivers;
    private Boolean active;
    private Boolean hasAnalytics;
    private Boolean hasVoiceAssistant;
    private List<String> features;
}
