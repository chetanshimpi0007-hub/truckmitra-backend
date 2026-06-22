package com.truckmitra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionDTO {
    private String label;
    private Double predictedValue;
    private Double confidence;
    private String unit;
    private Map<String, Object> metadata;
}
