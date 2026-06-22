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
public class RouteAnalyticsDTO {
    private List<PredictionDTO> topRoutes;
    private Map<String, Double> seasonalDemand;
    private Map<String, Double> mostDemandedCities;
    private String topRoute;
}
