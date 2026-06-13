package com.truckmitra.service.impl;

import com.truckmitra.dto.request.VehicleRequest;
import com.truckmitra.entity.fleet.Vehicle;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.fleet.VehicleRepository;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final TransporterRepository transporterRepository;
    private final com.truckmitra.service.common.SubscriptionService subscriptionService;

    @Override
    @Transactional
    public Vehicle addVehicle(VehicleRequest request, User user) {
        if (!subscriptionService.canPerformAction(user, "VEHICLE_ADD")) {
            throw new RuntimeException("Vehicle limit reached for your current subscription. Please upgrade.");
        }
        Transporter transporter = transporterRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Transporter not found"));

        Vehicle vehicle = Vehicle.builder()
                .vehicleNumber(request.getVehicleNumber())
                .vehicleType(request.getVehicleType())
                .capacity(request.getCapacity())
                .rcNumber(request.getRcNumber())
                .model(request.getModel())
                .manufacturer(request.getManufacturer())
                .insuranceNumber(request.getInsuranceNumber())
                .insuranceExpiry(request.getInsuranceExpiry())
                .fitnessCertificateNumber(request.getFitnessCertificateNumber())
                .fitnessExpiry(request.getFitnessExpiry())
                .permitNumber(request.getPermitNumber())
                .permitExpiry(request.getPermitExpiry())
                .pollutionCertificateNumber(request.getPollutionCertificateNumber())
                .pollutionExpiry(request.getPollutionExpiry())
                .vehicleFrontImageUrl(request.getVehicleFrontImageUrl())
                .vehicleBackImageUrl(request.getVehicleBackImageUrl())
                .vehicleRcImageUrl(request.getVehicleRcImageUrl())
                .transporter(transporter)
                .isAvailable(true)
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        
        // Update transporter's vehicle list
        transporter.addVehicle(savedVehicle.getId());
        transporterRepository.save(transporter);
        
        return savedVehicle;
    }

    @Override
    public List<Vehicle> getMyVehicles(User user) {
        return vehicleRepository.findByTransporterId(user.getId());
    }

    @Override
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id, User user) {
        Vehicle vehicle = getVehicleById(id);
        if (!vehicle.getTransporter().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this vehicle");
        }
        vehicleRepository.delete(vehicle);
    }

    @Override
    @Transactional
    public Vehicle updateVehicle(Long id, VehicleRequest request, User user) {
        Vehicle vehicle = getVehicleById(id);
        if (!vehicle.getTransporter().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this vehicle");
        }

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setRcNumber(request.getRcNumber());
        vehicle.setModel(request.getModel());
        vehicle.setManufacturer(request.getManufacturer());
        vehicle.setInsuranceNumber(request.getInsuranceNumber());
        vehicle.setInsuranceExpiry(request.getInsuranceExpiry());
        vehicle.setFitnessCertificateNumber(request.getFitnessCertificateNumber());
        vehicle.setFitnessExpiry(request.getFitnessExpiry());
        vehicle.setPermitNumber(request.getPermitNumber());
        vehicle.setPermitExpiry(request.getPermitExpiry());
        vehicle.setPollutionCertificateNumber(request.getPollutionCertificateNumber());
        vehicle.setPollutionExpiry(request.getPollutionExpiry());
        vehicle.setVehicleFrontImageUrl(request.getVehicleFrontImageUrl());
        vehicle.setVehicleBackImageUrl(request.getVehicleBackImageUrl());
        vehicle.setVehicleRcImageUrl(request.getVehicleRcImageUrl());

        return vehicleRepository.save(vehicle);
    }
}
