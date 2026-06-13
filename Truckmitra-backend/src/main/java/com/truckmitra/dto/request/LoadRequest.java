// src/main/java/com/truckmitra/dto/request/LoadRequest.java
package com.truckmitra.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
@Data
public class LoadRequest {
    private String source;
    private String destination;
    private Double weight;
    private String materialType;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime pickupDate;
    private BigDecimal budget;
    private Long transporterId; // For direct assignment
    @com.fasterxml.jackson.annotation.JsonProperty("isBiddingEnabled")
    private Boolean isBiddingEnabled;
}
