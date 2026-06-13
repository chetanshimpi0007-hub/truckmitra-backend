package com.truckmitra.controller;

import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.TripRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/telematics")
@RequiredArgsConstructor
public class TelematicsController {

    private final TripRepository tripRepository;

    @Data
    public static class LocationUpdate {
        private Double lat;
        private Double lng;
    }

    @PostMapping("/trip/{tripId}/update-location")
    public ResponseEntity<?> updateLocation(@PathVariable Long tripId, @RequestBody LocationUpdate update) {
        Optional<Trip> tripOpt = tripRepository.findById(tripId);
        if (tripOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Trip trip = tripOpt.get();
        trip.setCurrentLat(update.getLat());
        trip.setCurrentLng(update.getLng());
        
        tripRepository.save(trip);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trip/{tripId}/location")
    public ResponseEntity<LocationUpdate> getLocation(@PathVariable Long tripId) {
        Optional<Trip> tripOpt = tripRepository.findById(tripId);
        if (tripOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Trip trip = tripOpt.get();
        LocationUpdate loc = new LocationUpdate();
        loc.setLat(trip.getCurrentLat());
        loc.setLng(trip.getCurrentLng());
        
        return ResponseEntity.ok(loc);
    }
}
