package com.truckmitra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueForecastDTO {
    private Double currentRevenue;
    private Double forecastedRevenue;
    private Double growthPercentage;
    private Double confidencePercentage;
    private List<TrendDTO> monthlyTrends;
}
