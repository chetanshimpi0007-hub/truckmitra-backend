// src/main/java/com/truckmitra/service/route/RouteCalculationProvider.java
package com.truckmitra.service.route;

import com.truckmitra.dto.RouteData;

/**
 * Modular interface for route calculation providers.
 * Implement this to add support for Google Maps, HERE, or any other provider.
 * Current default: OSRM / OpenStreetMap (no API key required).
 */
public interface RouteCalculationProvider {

    /**
     * Calculate route between two address strings.
     *
     * @param sourceAddress      Human-readable source address (e.g., "Mumbai, Maharashtra")
     * @param destinationAddress Human-readable destination address (e.g., "Delhi, India")
     * @param weightTons         Load weight in metric tons (used for fuel calculation)
     * @return RouteData containing distance, ETA, coordinates, and calculated costs
     */
    RouteData calculateRoute(String sourceAddress, String destinationAddress, double weightTons);

    /**
     * Provider display name for logging and UI.
     */
    String getProviderName();
}
