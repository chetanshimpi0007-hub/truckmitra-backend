package com.truckmitra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilizationDTO {
    private Double overallUtilizationRate;
    private Double activeVehiclePercentage;
    private Double idleVehiclePercentage;
    private Double averageTripsPerVehicle;
    private Double predictedUtilizationRate;
    private Map<String, Double> utilizationByVehicleType;
    private List<TrendDTO> weeklyTrends;
    private String topPerformingVehicleType;
    private Double tripCompletionProbability;
    private Double lateDeliveryProbability;
}
