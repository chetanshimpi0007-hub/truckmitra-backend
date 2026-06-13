// src/main/java/com/truckmitra/dto/RouteData.java
package com.truckmitra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Holds the result of a route calculation from any RouteCalculationProvider.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteData {

    /** Distance in km */
    private Double distanceKm;

    /** Estimated travel time in minutes (based on average truck speed) */
    private Integer estimatedTravelTimeMins;

    /** Source latitude (resolved by geocoding) */
    private Double sourceLatitude;

    /** Source longitude (resolved by geocoding) */
    private Double sourceLongitude;

    /** Destination latitude (resolved by geocoding) */
    private Double destinationLatitude;

    /** Destination longitude (resolved by geocoding) */
    private Double destinationLongitude;

    /** Estimated number of toll plazas on route */
    private Integer tollPlazaCount;

    /** Estimated toll cost in INR */
    private Double estimatedTollCostInr;

    /** Fuel consumed in liters */
    private Double fuelEstimateLiters;

    /** CO₂ emission in kg */
    private Double carbonEmissionKg;

    /** Name of the provider that generated this data */
    private String providerName;
}
