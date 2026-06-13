package com.truckmitra.controller;

import com.truckmitra.dto.request.auth.RegisterRequest;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.common.enums.VehicleType;
import com.truckmitra.entity.user.Driver;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.entity.fleet.Vehicle;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.repository.fleet.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.List;

@RestController
public class TestE2EController {
    
    @Autowired private DriverRepository driverRepository;
    @Autowired private TransporterRepository transporterRepository;
    @Autowired private VehicleRepository vehicleRepository;

    @GetMapping("/api/test-e2e")
    @org.springframework.transaction.annotation.Transactional
    public Object runE2E() {
        try {
            Map<String, Object> result = new java.util.HashMap<>();
            List<Vehicle> existingVehicles = vehicleRepository.findByDriverId(7L);
            result.put("driver_7_vehicles_count", existingVehicles.size());
            if (!existingVehicles.isEmpty()) {
                result.put("driver_7_vehicle_id", existingVehicles.get(0).getId());
            }

            // Also check using EntityManager directly to see if soft-delete or lazy loading causes it
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage());
        }
    }
}
