// src/main/java/com/truckmitra/service/impl/CalculationServiceImpl.java
package com.truckmitra.service.impl;

import org.springframework.stereotype.Service;

@Service
public class CalculationServiceImpl {

    public Double calculateDistance(String source, String destination) {
        // Fail explicitly if external routing API is not configured.
        throw new IllegalStateException("Google Maps API or OSRM is not configured. Cannot calculate real distance from " + source + " to " + destination);
    }

    public Double calculateCarbonEmission(Double distance, Double weight) {
        // 0.1 kg CO₂ per km per ton
        return distance * weight * 0.1;
    }

    public Double calculateTollCost(Double distance) {
        // ₹2.5 per km (Indian national highway average)
        return distance * 2.5;
    }

    public Double calculateFuelCost(Double distance, Double weightTons) {
        // Diesel truck: efficiency decreases with weight
        // Base: 7 km/litre, reduces 0.4 km per ton loaded
        double kmPerLitre = Math.max(2.0, 7.0 - (weightTons * 0.4));
        double litresUsed = distance / kmPerLitre;
        double dieselPricePerLitre = 95.0; // ₹95/litre
        return litresUsed * dieselPricePerLitre;
    }
}
