package com.truckmitra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDTO {
    private Long id;
    private Long loadId;
    private Long transporterId;
    private Double matchScore;
    private Double confidencePercentage;
    private List<String> reasons;
    private String status;
    private LocalDateTime createdAt;

    // Load Details (for transporter view - private shipper info hidden)
    private String source;
    private String destination;
    private Double weight;
    private String materialType;
    private BigDecimal budget;
    private LocalDateTime pickupDate;
    private Double estimatedDistanceKm;
    private Boolean isBiddingEnabled;

    // Transporter Details (for shipper/admin view)
    private String agencyName;
    private String transporterName;
    private Double transporterRating;
    private Integer fleetSize;
}
