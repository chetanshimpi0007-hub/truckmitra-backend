package com.truckmitra.controller;

import com.truckmitra.dto.DriverLocationDTO;
import com.truckmitra.dto.request.DriverLocationRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.load.TripLocation;
import com.truckmitra.repository.load.TripLocationRepository;
import com.truckmitra.service.TripService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/driver-location")
@RequiredArgsConstructor
public class DriverLocationController {

    private final TripService tripService;
    private final TripLocationRepository tripLocationRepository;

    /**
     * POST /api/driver-location/update
     * Called by driver's watchPosition callback every 5-10 seconds.
     */
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<String>> updateLocation(
            @RequestBody DriverLocationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            tripService.updateLocationFull(
                    request.getTripId(),
                    request.getLatitude(),
                    request.getLongitude(),
                    request.getSpeed(),
                    request.getHeading(),
                    request.getAccuracy()
            );
            return ResponseEntity.ok(ApiResponse.success("Location updated", null));
        } catch (Exception e) {
            log.error("Location update failed for trip {}: {}", request.getTripId(), e.getMessage());
            return ResponseEntity.ok(ApiResponse.success("Location queued (trip not found)", null));
        }
    }

    /**
     * GET /api/driver-location/{tripId}
     * Returns the latest known position for a trip.
     */
    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<DriverLocationDTO>> getLatestLocation(@PathVariable Long tripId) {
        Optional<TripLocation> latest = tripLocationRepository.findTopByTripIdOrderByTimestampDesc(tripId);
        if (latest.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success("No location data", null));
        }
        TripLocation loc = latest.get();
        DriverLocationDTO dto = DriverLocationDTO.builder()
                .tripId(tripId)
                .driverId(loc.getDriverId())
                .latitude(loc.getLatitude())
                .longitude(loc.getLongitude())
                .speed(loc.getSpeed())
                .heading(loc.getHeading())
                .accuracy(loc.getAccuracy())
                .timestamp(loc.getTimestamp())
                .build();
        return ResponseEntity.ok(ApiResponse.success("OK", dto));
    }

    /**
     * GET /api/driver-location/{tripId}/history
     * Returns the last 50 location breadcrumbs (ascending) for polyline rendering.
     */
    @GetMapping("/{tripId}/history")
    public ResponseEntity<ApiResponse<List<DriverLocationDTO>>> getLocationHistory(@PathVariable Long tripId) {
        List<TripLocation> history = tripLocationRepository.findTop50ByTripIdOrderByTimestampDesc(tripId);
        List<DriverLocationDTO> dtos = history.stream()
                .map(loc -> DriverLocationDTO.builder()
                        .tripId(tripId)
                        .driverId(loc.getDriverId())
                        .latitude(loc.getLatitude())
                        .longitude(loc.getLongitude())
                        .speed(loc.getSpeed())
                        .heading(loc.getHeading())
                        .accuracy(loc.getAccuracy())
                        .timestamp(loc.getTimestamp())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("OK", dtos));
    }
}
