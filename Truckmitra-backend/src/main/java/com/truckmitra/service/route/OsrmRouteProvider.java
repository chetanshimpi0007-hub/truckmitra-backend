// src/main/java/com/truckmitra/service/route/OsrmRouteProvider.java
package com.truckmitra.service.route;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.truckmitra.dto.RouteData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Route calculation using OpenStreetMap Nominatim (geocoding) + OSRM (routing).
 * Completely free — no API key required.
 *
 * Geocoding:  https://nominatim.openstreetmap.org/search
 * Routing:    https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}
 *
 * Toll & Fuel are calculated algorithmically (plug-in a TollGuru key later).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OsrmRouteProvider implements RouteCalculationProvider {

    private static final String NOMINATIM_URL =
            "https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=1";
    private static final String OSRM_URL =
            "https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false";

    // Average truck speed on Indian highways: ~55 km/h
    private static final double AVG_TRUCK_SPEED_KMH = 55.0;
    // Toll estimate: ₹1.5 per km on national highways (algorithmic fallback)
    private static final double TOLL_COST_PER_KM = 1.5;
    // Toll plaza every ~80 km on average
    private static final double TOLL_PLAZA_EVERY_KM = 80.0;
    // Diesel: 7 km/litre at base, reduced by weight
    private static final double BASE_FUEL_EFFICIENCY_KM_PER_LITRE = 7.0;
    private static final double WEIGHT_PENALTY_PER_TON = 0.4;
    // CO₂: 2.68 kg per litre of diesel
    private static final double CO2_PER_LITRE_DIESEL = 2.68;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public String getProviderName() {
        return "OSRM/OpenStreetMap";
    }

    @Override
    public RouteData calculateRoute(String sourceAddress, String destinationAddress, double weightTons) {
        try {
            double[] srcCoords = geocode(sourceAddress);
            double[] dstCoords = geocode(destinationAddress);

            if (srcCoords == null || dstCoords == null) {
                log.warn("Geocoding failed for source='{}' or destination='{}'. Using haversine fallback.",
                        sourceAddress, destinationAddress);
                return fallbackHaversine(sourceAddress, destinationAddress, weightTons, null, null);
            }

            double distanceKm = getOsrmDistance(srcCoords[0], srcCoords[1], dstCoords[0], dstCoords[1]);

            return buildRouteData(
                    distanceKm, weightTons,
                    srcCoords[0], srcCoords[1],
                    dstCoords[0], dstCoords[1]);

        } catch (Exception e) {
            log.error("OSRM route calculation failed for '{}' → '{}': {}",
                    sourceAddress, destinationAddress, e.getMessage());
            // Return algorithmic fallback so the trip can still proceed
            return fallbackHaversine(sourceAddress, destinationAddress, weightTons, null, null);
        }
    }

    // ── GEOCODE via Nominatim ──────────────────────────────────────────────────

    private double[] geocode(String address) {
        try {
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + java.net.URLEncoder.encode(address, "UTF-8")
                    + "&format=json&limit=1&countrycodes=in";

            // Nominatim requires a User-Agent header
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "TruckMitra/1.0 (contact@truckmitra.in)");
            org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);

            org.springframework.http.ResponseEntity<String> response =
                    restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class);

            JsonNode arr = objectMapper.readTree(response.getBody());
            if (arr.isArray() && arr.size() > 0) {
                JsonNode place = arr.get(0);
                double lat = place.get("lat").asDouble();
                double lon = place.get("lon").asDouble();
                log.debug("Geocoded '{}' → lat={}, lon={}", address, lat, lon);
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            log.warn("Nominatim geocoding failed for '{}': {}", address, e.getMessage());
        }
        return null;
    }

    // ── OSRM Distance ─────────────────────────────────────────────────────────

    private double getOsrmDistance(double srcLat, double srcLon, double dstLat, double dstLon) {
        try {
            String url = "https://router.project-osrm.org/route/v1/driving/"
                    + srcLon + "," + srcLat + ";"
                    + dstLon + "," + dstLat + "?overview=false";

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "TruckMitra/1.0");
            org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);

            org.springframework.http.ResponseEntity<String> response =
                    restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            if ("Ok".equals(root.path("code").asText())) {
                double meters = root.path("routes").get(0).path("distance").asDouble();
                double km = meters / 1000.0;
                log.info("OSRM distance: {:.2f} km", km);
                return km;
            }
        } catch (Exception e) {
            log.warn("OSRM routing failed: {}", e.getMessage());
        }
        // Fallback: Haversine
        return haversineKm(srcLat, srcLon, dstLat, dstLon);
    }

    // ── Haversine (straight-line distance × 1.35 road factor) ─────────────────

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1.35; // road-factor adjustment
    }

    // ── Build RouteData ───────────────────────────────────────────────────────

    private RouteData buildRouteData(double distanceKm, double weightTons,
                                      double srcLat, double srcLon,
                                      double dstLat, double dstLon) {
        int etaMins = (int) Math.round((distanceKm / AVG_TRUCK_SPEED_KMH) * 60);
        int tollPlazas = (int) Math.max(1, Math.round(distanceKm / TOLL_PLAZA_EVERY_KM));
        double tollCost = distanceKm * TOLL_COST_PER_KM;

        double efficiency = Math.max(2.0, BASE_FUEL_EFFICIENCY_KM_PER_LITRE - (weightTons * WEIGHT_PENALTY_PER_TON));
        double fuelLitres = distanceKm / efficiency;
        double carbonKg = fuelLitres * CO2_PER_LITRE_DIESEL;

        return RouteData.builder()
                .distanceKm(Math.round(distanceKm * 100.0) / 100.0)
                .estimatedTravelTimeMins(etaMins)
                .sourceLatitude(srcLat)
                .sourceLongitude(srcLon)
                .destinationLatitude(dstLat)
                .destinationLongitude(dstLon)
                .tollPlazaCount(tollPlazas)
                .estimatedTollCostInr(Math.round(tollCost * 100.0) / 100.0)
                .fuelEstimateLiters(Math.round(fuelLitres * 100.0) / 100.0)
                .carbonEmissionKg(Math.round(carbonKg * 100.0) / 100.0)
                .providerName(getProviderName())
                .build();
    }

    private RouteData fallbackHaversine(String src, String dst, double weightTons,
                                         double[] srcCoords, double[] dstCoords) {
        // Use India center as placeholder if no coords
        double lat1 = srcCoords != null ? srcCoords[0] : 19.0760;
        double lon1 = srcCoords != null ? srcCoords[1] : 72.8777;
        double lat2 = dstCoords != null ? dstCoords[0] : 28.6139;
        double lon2 = dstCoords != null ? dstCoords[1] : 77.2090;

        double distKm = haversineKm(lat1, lon1, lat2, lon2);
        return buildRouteData(distKm, weightTons, lat1, lon1, lat2, lon2);
    }
}
