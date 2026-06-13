package com.truckmitra.controller.user;

import com.truckmitra.dto.request.LocationRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/driver")
@RequiredArgsConstructor
public class DriverMobileController {

    private final TripService tripService;

    @PostMapping("/location")
    public ResponseEntity<ApiResponse<String>> updateLocation(@Valid @RequestBody LocationRequest request) {
        tripService.updateLocation(request.getTripId(), request.getLatitude(), request.getLongitude(), 0.0);
        return ResponseEntity.ok(ApiResponse.success("Location recorded", null));
    }

    @GetMapping("/trips/{driverId}")
    public ResponseEntity<List<Trip>> getDriverTrips(@PathVariable Long driverId) {
        return ResponseEntity.ok(tripService.getDriverTrips(driverId));
    }

    @PostMapping("/trip/{tripId}/accept")
    public ResponseEntity<Trip> acceptTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.updateTripStatus(tripId, "DRIVER_ASSIGNED"));
    }

    @PostMapping("/trip/{tripId}/start")
    public ResponseEntity<Trip> startTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.startTrip(tripId));
    }

    @PostMapping("/trip/{tripId}/deliver")
    public ResponseEntity<Trip> markDelivered(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.updateTripStatus(tripId, "DELIVERED"));
    }
}
