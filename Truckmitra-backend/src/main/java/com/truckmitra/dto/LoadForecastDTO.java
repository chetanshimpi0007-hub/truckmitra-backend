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
public class LoadForecastDTO {
    private Double currentVolume;
    private Double forecastedVolume;
    private Double growthPercentage;
    private Double confidencePercentage;
    private String peakDay;
    private String peakHour;
    private List<TrendDTO> loadTrends;
}
