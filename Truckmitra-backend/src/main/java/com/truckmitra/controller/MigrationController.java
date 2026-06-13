package com.truckmitra.controller;

import com.truckmitra.entity.fleet.Vehicle;
import com.truckmitra.entity.user.Driver;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.repository.fleet.VehicleRepository;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.repository.user.TransporterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
public class MigrationController {

    @Autowired private DriverRepository driverRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private TransporterRepository transporterRepository;

    @GetMapping("/api/migrate-orphaned-vehicles")
    @Transactional
    public Map<String, Object> migrateVehicles() {
        Map<String, Object> result = new HashMap<>();
        List<Driver> allDrivers = driverRepository.findAll();
        int orphanedCount = 0;
        int vehiclesCreated = 0;

        for (Driver driver : allDrivers) {
            if (driver.getVehicleNumber() != null && !driver.getVehicleNumber().trim().isEmpty()) {
                // Check if a vehicle already exists for this driver
                List<Vehicle> existingVehicles = vehicleRepository.findByDriverId(driver.getId());
                if (existingVehicles == null || existingVehicles.isEmpty()) {
                    orphanedCount++;

                    Double capacityVal = 1.0;
                    if (driver.getVehicleCapacity() != null && !driver.getVehicleCapacity().trim().isEmpty()) {
                        try {
                            String digits = driver.getVehicleCapacity().replaceAll("[^0-9.]", "");
                            if (!digits.isEmpty()) {
                                capacityVal = Double.parseDouble(digits);
                            }
                        } catch (Exception ignored) {}
                    }

                    // Get Transporter
                    Transporter transporter = null;
                    if (driver.getTransporterId() != null) {
                        transporter = transporterRepository.findById(driver.getTransporterId()).orElse(null);
                    }

                    Vehicle vehicle = Vehicle.builder()
                            .vehicleNumber(driver.getVehicleNumber())
                            .vehicleType("TRUCK")
                            .capacity(capacityVal)
                            .vehicleFrontImageUrl(driver.getVehicleFrontImageUrl())
                            .vehicleBackImageUrl(driver.getVehicleBackImageUrl())
                            .vehicleRcImageUrl(driver.getVehiclePucImageUrl())
                            .transporter(transporter)
                            .driver(driver)
                            .isAvailable(true)
                            .isDeleted(false)
                            .isActive(true)
                            .build();

                    Vehicle savedVehicle = vehicleRepository.save(vehicle);
                    vehiclesCreated++;

                    if (transporter != null) {
                        transporter.addVehicle(savedVehicle.getId());
                        transporterRepository.save(transporter);
                    }
                }
            }
        }

        result.put("orphaned_drivers_found", orphanedCount);
        result.put("vehicles_created", vehiclesCreated);
        result.put("status", "Migration completed successfully");

        return result;
    }
}
