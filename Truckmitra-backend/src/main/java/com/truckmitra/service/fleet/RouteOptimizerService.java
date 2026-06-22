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

        try {
            RestTemplate restTemplate = new RestTemplate();
            org.springframework.http.ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new IllegalStateException("Failed to fetch route from OSRM");
            }
            
            org.json.JSONObject json = new org.json.JSONObject(response.getBody());
            org.json.JSONArray routes = json.optJSONArray("routes");
            if (routes == null || routes.length() == 0) {
                throw new IllegalStateException("No route found from OSRM");
            }
            
            org.json.JSONObject route = routes.getJSONObject(0);
            Double distance = route.optDouble("distance", 0.0) / 1000.0; // convert to KM
            Double duration = route.optDouble("duration", 0.0) / 60.0; // convert to Minutes

            RouteResponse routeResponse = new RouteResponse();
            routeResponse.setTotalDistance(distance);
            routeResponse.setTotalDuration(duration);
            return routeResponse;
        } catch (Exception e) {
            throw new IllegalStateException("OSRM Routing failed: " + e.getMessage(), e);
        }
    }

    public Double calculateTolls(Double distance) {
        String tollApiKey = System.getenv("TOLL_API_KEY");
        if (tollApiKey == null || tollApiKey.trim().isEmpty()) {
            throw new IllegalStateException("Toll API is not configured. TOLL_API_KEY is missing.");
        }
        // If configured, we would call the toll API here. For now, since key exists, we can return 0
        return 0.0;
    }
}
