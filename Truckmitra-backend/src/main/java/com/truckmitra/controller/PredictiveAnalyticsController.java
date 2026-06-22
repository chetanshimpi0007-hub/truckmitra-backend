package com.truckmitra.controller;

import com.truckmitra.dto.*;
import com.truckmitra.service.admin.PredictiveAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/analytics/predictive")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PredictiveAnalyticsController {

    private final PredictiveAnalyticsService predictiveAnalyticsService;

    /**
     * GET /api/analytics/predictive/load-volume
     * Forecast next month's load volume using WMA on last 6 months.
     */
    @GetMapping("/load-volume")
    public ResponseEntity<LoadForecastDTO> getLoadVolumeForecast() {
        log.info("Predictive: load-volume forecast requested");
        return ResponseEntity.ok(predictiveAnalyticsService.forecastLoadVolume());
    }

    /**
     * GET /api/analytics/predictive/revenue
     * Forecast next month's revenue using WMA on last 6 months of completed trips.
     */
    @GetMapping("/revenue")
    public ResponseEntity<RevenueForecastDTO> getRevenueForecast() {
        log.info("Predictive: revenue forecast requested");
        return ResponseEntity.ok(predictiveAnalyticsService.forecastRevenue());
    }

    /**
     * GET /api/analytics/predictive/routes
     * Analyze top routes, seasonal demand, and most demanded pickup cities.
     */
    @GetMapping("/routes")
    public ResponseEntity<RouteAnalyticsDTO> getRouteAnalytics() {
        log.info("Predictive: route analytics requested");
        return ResponseEntity.ok(predictiveAnalyticsService.analyzeRoutes());
    }

    /**
     * GET /api/analytics/predictive/utilization
     * Analyze vehicle utilization, trip completion, and late delivery probabilities.
     */
    @GetMapping("/utilization")
    public ResponseEntity<UtilizationDTO> getUtilizationAnalytics() {
        log.info("Predictive: utilization analytics requested");
        return ResponseEntity.ok(predictiveAnalyticsService.analyzeUtilization());
    }
}
