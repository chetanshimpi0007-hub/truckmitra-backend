package com.truckmitra.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VehicleRequest {
    private String vehicleNumber;
    private String vehicleType;
    private Double capacity;
    private String rcNumber;
    private String model;
    private String manufacturer;
    private String insuranceNumber;
    private LocalDate insuranceExpiry;
    private String fitnessCertificateNumber;
    private LocalDate fitnessExpiry;
    private String permitNumber;
    private LocalDate permitExpiry;
    private String pollutionCertificateNumber;
    private LocalDate pollutionExpiry;
    private String vehicleFrontImageUrl;
    private String vehicleBackImageUrl;
    private String vehicleRcImageUrl;
}
