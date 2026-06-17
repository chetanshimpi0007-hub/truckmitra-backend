package com.truckmitra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuelProfitCalculationResponse {
    private Double distanceKm;
    private Double averageMileage;
    private Double dieselRate;
    private Double estimatedFuelConsumption;
    private BigDecimal estimatedFuelCost;
    private BigDecimal estimatedProfit;
    private String profitClassification; // GOOD, MEDIUM, LOW
}
