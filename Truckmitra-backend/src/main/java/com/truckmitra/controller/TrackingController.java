package com.truckmitra.controller;

import com.truckmitra.dto.request.LocationRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TripService tripService;
    private final com.truckmitra.repository.auth.UserRepository userRepository;

    @PostMapping("/update")
    public ResponseEntity<ApiResponse<String>> updateLocation(@Valid @RequestBody LocationRequest request) {
        tripService.updateLocation(request.getTripId(), request.getLatitude(), request.getLongitude(), 0.0);
        ApiResponse<String> response = ApiResponse.success("Location updated successfully", null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/driver/location")
    public ResponseEntity<ApiResponse<String>> updateDriverLocation(@Valid @RequestBody LocationRequest request) {
        tripService.updateLocation(request.getTripId(), request.getLatitude(), request.getLongitude(), 0.0);
        return ResponseEntity.ok(ApiResponse.success("Location recorded", null));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getLocation(@PathVariable Long tripId) {
        // Here we just return the full trip which contains the current lat/lng
        Trip trip = tripService.getTripById(tripId);
        return ResponseEntity.ok(trip);
    }
    
    @GetMapping("/admin/active")
    public ResponseEntity<java.util.List<Trip>> getActiveTripsForAdmin() {
        return ResponseEntity.ok(tripService.getActiveTripsForAdmin());
    }

    @GetMapping("/shipper/active")
    public ResponseEntity<java.util.List<Trip>> getActiveTripsForShipper(@org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        com.truckmitra.entity.user.User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElse(null));
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(tripService.getActiveTripsForShipper(user.getId()));
    }
}
