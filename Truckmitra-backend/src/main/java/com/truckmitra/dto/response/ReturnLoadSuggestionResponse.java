package com.truckmitra.dto.response;

import com.truckmitra.entity.common.enums.LoadStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReturnLoadSuggestionResponse {
    private Long loadId;
    private String sourceCity;
    private String destinationCity;
    private String material;
    private Double weight;
    private BigDecimal shipperAmount;
    private LoadStatus loadStatus;
    private LocalDateTime createdAt;
}
