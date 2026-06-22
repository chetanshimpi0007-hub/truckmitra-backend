package com.truckmitra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendDTO {
    private String period;    // e.g. "Jan 2026", "Week 24"
    private Double value;     // historical or actual value
    private Double change;    // % change from previous period
}
