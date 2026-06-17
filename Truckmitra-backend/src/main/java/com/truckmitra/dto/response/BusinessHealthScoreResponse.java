package com.truckmitra.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class BusinessHealthScoreResponse {
    private Integer overallScore;
    private String grade;

    private Integer podComplianceScore;
    private Integer driverUtilizationScore;
    private Integer fleetUtilizationScore;
    private Integer returnLoadScore;
    private Integer profitabilityScore;

    private List<String> recommendations;
}
