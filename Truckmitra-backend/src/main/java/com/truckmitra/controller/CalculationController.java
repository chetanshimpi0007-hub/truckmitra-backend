package com.truckmitra.controller;

import com.truckmitra.service.impl.CalculationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Provides automatic route calculations (distance, toll, fuel, carbon)
 * used by the Transporter Dashboard when assigning a driver to a load.
 */
@RestController
@RequestMapping("/api/calculate")
@RequiredArgsConstructor
public class CalculationController {

    private final CalculationServiceImpl calculationService;

    /**
     * Auto-calculate all route metrics for a given source → destination.
     * Returns: distance (km), tollFare (₹), fuelCost (₹), carbonEmission (kg)
     */
    @GetMapping("/route")
    public ResponseEntity<Map<String, Object>> calculateRoute(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(defaultValue = "1.0") Double weightTons) {

        double distance      = calculationService.calculateDistance(source, destination);
        double toll          = calculationService.calculateTollCost(distance);
        double fuel          = calculationService.calculateFuelCost(distance, weightTons);
        double carbon        = calculationService.calculateCarbonEmission(distance, weightTons);

        Map<String, Object> result = new HashMap<>();
        result.put("source",          source);
        result.put("destination",     destination);
        result.put("distanceKm",      Math.round(distance * 10.0) / 10.0);
        result.put("tollFare",        Math.round(toll * 100.0) / 100.0);
        result.put("fuelCost",        Math.round(fuel * 100.0) / 100.0);
        result.put("carbonEmission",  Math.round(carbon * 100.0) / 100.0);

        return ResponseEntity.ok(result);
    }
}
