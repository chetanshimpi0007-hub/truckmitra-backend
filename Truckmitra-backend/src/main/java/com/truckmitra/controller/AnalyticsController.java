package com.truckmitra.controller;

import com.truckmitra.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<?> getAdminStats() {
        return ResponseEntity.ok(analyticsService.getAdminAnalytics());
    }

    @PreAuthorize("hasRole('SHIPPER')")
    @GetMapping("/shipper")
    public ResponseEntity<?> getShipperStats(@RequestParam Long userId) {
        return ResponseEntity.ok(analyticsService.getShipperAnalytics(userId));
    }

    @PreAuthorize("hasRole('TRANSPORTER')")
    @GetMapping("/transporter")
    public ResponseEntity<?> getTransporterStats(@RequestParam Long userId) {
        return ResponseEntity.ok(analyticsService.getTransporterAnalytics(userId));
    }
}
