package com.truckmitra.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class VoiceLoadParseResponse {
    private String sourceCity;
    private String destinationCity;
    private String material;
    private Double weight;
    private BigDecimal amount;
    private String vehicleType;
    private Double confidenceScore;
}
