// src/main/java/com/truckmitra/service/impl/CalculationServiceImpl.java
package com.truckmitra.service.impl;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class CalculationServiceImpl {

    private final Random random = new Random();

    public Double calculateDistance(String source, String destination) {
        // Realistic mock: 100–1500 km range (replace with Google Maps API if needed)
        return 100 + (1400) * random.nextDouble();
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
