package com.truckmitra.controller;

import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.BusinessHealthScoreResponse;
import com.truckmitra.security.SecurityUtils;
import com.truckmitra.service.transporter.BusinessHealthScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transporters")
@RequiredArgsConstructor
public class BusinessHealthController {

    private final BusinessHealthScoreService businessHealthScoreService;

    @GetMapping("/business-health")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<ApiResponse<BusinessHealthScoreResponse>> getBusinessHealth() {
        Long transporterId = SecurityUtils.getCurrentUserId();
        BusinessHealthScoreResponse response = businessHealthScoreService.calculateForTransporter(transporterId);
        return ResponseEntity.ok(ApiResponse.success("Business Health Score retrieved successfully", response));
    }
}
