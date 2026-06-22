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
public class MatchScoreDTO {
    private Double score;
    private Double confidence;
    private List<String> reasons;
    private Map<String, Double> factorScores;
}
