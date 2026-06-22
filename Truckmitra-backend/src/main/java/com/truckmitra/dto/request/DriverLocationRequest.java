package com.truckmitra.dto.request;

import lombok.Data;

@Data
public class DriverLocationRequest {
    private Long tripId;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private Double heading;
    private Double accuracy;
}
