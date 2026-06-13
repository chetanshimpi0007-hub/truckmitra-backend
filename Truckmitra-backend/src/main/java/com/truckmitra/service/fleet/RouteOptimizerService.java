package com.truckmitra.service.fleet;

import lombok.Data;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class RouteOptimizerService {

    @Data
    public static class RouteStep {
        private String instruction;
        private Double latitude;
        private Double longitude;
        private Double distance; // in meters
    }

    @Data
    public static class RouteResponse {
        private Double totalDistance; // in KM
        private Double totalDuration; // in Minutes
        private List<RouteStep> steps = new ArrayList<>();
        private List<Double[]> path = new ArrayList<>(); // LatLng pairs
    }

    /**
     * Uses OSRM (Open Source Routing Machine) which is free and doesn't require a key.
     */
    public RouteResponse getBestRoute(Double startLat, Double startLng, Double endLat, Double endLng) {
        String url = String.format("http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&steps=true", 
                startLng, startLat, endLng, endLat);

        // In a real app, use RestTemplate to fetch real data
        // For this demo, we'll return a mock route that simulates the OSRM response structure
        
        RouteResponse res = new RouteResponse();
        res.setTotalDistance(124.5);
        res.setTotalDuration(150.0);
        
        // Mocking path points
        res.getPath().add(new Double[]{startLat, startLng});
        res.getPath().add(new Double[]{(startLat + endLat) / 2, (startLng + endLng) / 2});
        res.getPath().add(new Double[]{endLat, endLng});
        
        return res;
    }

    public Double calculateTolls(Double distance) {
        // Mock toll calculation: Rs 4.5 per KM for heavy vehicles
        return Math.round(distance * 4.5 * 100.0) / 100.0;
    }
}
