package com.truckmitra.controller.admin;

import com.truckmitra.dto.response.AdminActivityDashboardStatsDto;
import com.truckmitra.entity.AuditLog;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.service.AdminActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/activity")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminActivityController {

    private final AdminActivityService adminActivityService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<AdminActivityDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminActivityService.getDashboardStats());
    }

    @GetMapping("/timeline")
    public ResponseEntity<List<AuditLog>> getTimeline(@RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(adminActivityService.getTimeline(limit));
    }

    @GetMapping("/trips-master")
    public ResponseEntity<Page<Trip>> getTripsMaster(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminActivityService.getTripsMaster(search, PageRequest.of(page, size)));
    }
}
