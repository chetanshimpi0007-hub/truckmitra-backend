package com.truckmitra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverAvailabilitySummaryResponse {
    private Long availableDriversCount;
    private Long onTripDriversCount;
    private Long offlineDriversCount;
    private Map<String, Long> cityWiseAvailableDrivers;
}
