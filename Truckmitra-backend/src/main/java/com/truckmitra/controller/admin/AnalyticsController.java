package com.truckmitra.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("adminAnalyticsDashboardController")
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getAnalyticsDashboard() {
        // In a real application, this would query AI models or aggregate complex metrics.
        // For demonstration, we provide dummy AI-generated stats.
        Map<String, Object> response = Map.of(
                "totalRevenue", 1250000,
                "fleetUtilization", 87.5,
                "activeTrips", 42,
                "sustainabilityScore", 92.4, // Eco-friendly rating
                "co2SavedTonnes", 14.2,
                "aiRevenueForecast", 1450000
        );

        return ResponseEntity.ok(response);
    }
}
