package com.truckmitra.service;

import com.truckmitra.dto.request.VehicleRequest;
import com.truckmitra.entity.fleet.Vehicle;
import com.truckmitra.entity.user.User;

import java.util.List;

public interface VehicleService {
    Vehicle addVehicle(VehicleRequest request, User user);
    List<Vehicle> getMyVehicles(User user);
    Vehicle getVehicleById(Long id);
    void deleteVehicle(Long id, User user);
    Vehicle updateVehicle(Long id, VehicleRequest request, User user);
}
