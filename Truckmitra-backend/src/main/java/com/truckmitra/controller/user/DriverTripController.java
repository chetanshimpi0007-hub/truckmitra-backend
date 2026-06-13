package com.truckmitra.controller.user;

import com.truckmitra.dto.request.LocationRequest;
import com.truckmitra.dto.request.load.PODUploadRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.load.TripLocation;
import com.truckmitra.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver/trips")
@RequiredArgsConstructor
public class DriverTripController {

    private final TripService tripService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<Trip>> getMyTrips() {
        Long driverId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        if (driverId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(tripService.getDriverTrips(driverId));
    }

    @PostMapping("/{tripId}/accept")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Trip>> acceptTrip(@PathVariable Long tripId) {
        Trip trip = tripService.acceptTripAssignment(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip accepted", trip));
    }

    @PostMapping("/{tripId}/reject")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Trip>> rejectTrip(@PathVariable Long tripId) {
        Trip trip = tripService.rejectTripAssignment(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip rejected", trip));
    }

    @PostMapping("/{tripId}/start")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Trip>> startTrip(@PathVariable Long tripId) {
        Trip trip = tripService.startTrip(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip started", trip));
    }

    @PostMapping("/{tripId}/pause")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Trip>> pauseTrip(@PathVariable Long tripId) {
        Trip trip = tripService.pauseTrip(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip paused", trip));
    }

    @PostMapping("/{tripId}/resume")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Trip>> resumeTrip(@PathVariable Long tripId) {
        Trip trip = tripService.resumeTrip(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip resumed", trip));
    }

    @PostMapping("/{tripId}/pod")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<String>> uploadPOD(@PathVariable Long tripId, @RequestBody PODUploadRequest request) {
        tripService.uploadPOD(tripId, request);
        return ResponseEntity.ok(ApiResponse.success("POD uploaded successfully", null));
    }

    @PostMapping("/{tripId}/deliver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Trip>> markDelivered(@PathVariable Long tripId) {
        Trip trip = tripService.markDelivered(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip marked as delivered", trip));
    }

    @PostMapping("/location")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<String>> updateLocation(@RequestBody LocationRequest request) {
        // Speed is optional, defaulting to 0 for now if not in request
        tripService.updateLocation(request.getTripId(), request.getLatitude(), request.getLongitude(), 0.0);
        return ResponseEntity.ok(ApiResponse.success("Location updated", null));
    }

    @GetMapping("/{tripId}/history")
    public ResponseEntity<List<TripLocation>> getHistory(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.getTrackingHistory(tripId));
    }
}
