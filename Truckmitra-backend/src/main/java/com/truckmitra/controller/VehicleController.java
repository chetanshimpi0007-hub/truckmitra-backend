package com.truckmitra.controller;

import com.truckmitra.dto.request.VehicleRequest;
import com.truckmitra.entity.fleet.Vehicle;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.truckmitra.repository.fleet.VehicleRepository;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    private User resolveUser(UserDetails userDetails) {
        String username = userDetails.getUsername();
        return userRepository.findByMobile(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));
    }

    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(@RequestBody VehicleRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return ResponseEntity.ok(vehicleService.addVehicle(request, user));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Vehicle>> getVehiclesByDriverId(@PathVariable Long driverId) {
        return ResponseEntity.ok(vehicleRepository.findByDriverId(driverId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Vehicle>> getMyVehicles(@AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return ResponseEntity.ok(vehicleService.getMyVehicles(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody VehicleRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        vehicleService.deleteVehicle(id, user);
        return ResponseEntity.ok().build();
    }
}
