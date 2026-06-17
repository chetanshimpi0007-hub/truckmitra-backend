package com.truckmitra.service.load.impl;

import com.truckmitra.dto.response.FuelProfitCalculationResponse;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.user.User;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.security.SecurityUtils;
import com.truckmitra.service.load.FuelProfitCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class FuelProfitCalculatorServiceImpl implements FuelProfitCalculatorService {

    private final LoadRepository loadRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Value("${truckmitra.diesel.rate:95.0}")
    private Double dieselRate;

    @Override
    public FuelProfitCalculationResponse calculateForLoad(Long loadId) {
        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found"));

        validateAccess(load);

        Double distanceKm = load.getEstimatedDistanceKm() != null ? load.getEstimatedDistanceKm() : 0.0;
        BigDecimal shipperAmount = load.getBudget() != null ? load.getBudget() : BigDecimal.ZERO;
        
        // For unassigned loads, we don't know the exact vehicle yet, so use a default fleet average of 4.0
        return calculate(distanceKm, 4.0, shipperAmount, BigDecimal.ZERO);
    }

    @Override
    public FuelProfitCalculationResponse calculateForTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        validateAccess(trip);

        Double distanceKm = trip.getDistance() != null ? trip.getDistance() : 0.0;
        
        Double averageMileage = 4.0;
        if (trip.getVehicle() != null && trip.getVehicle().getAverageMileage() != null) {
            averageMileage = trip.getVehicle().getAverageMileage();
        }

        BigDecimal shipperAmount = trip.getShipperAmount() != null ? trip.getShipperAmount() : BigDecimal.ZERO;
        BigDecimal driverAmount = trip.getDriverAmount() != null ? trip.getDriverAmount() : BigDecimal.ZERO;

        return calculate(distanceKm, averageMileage, shipperAmount, driverAmount);
    }

    private FuelProfitCalculationResponse calculate(Double distanceKm, Double mileage, BigDecimal shipperAmount, BigDecimal driverAmount) {
        if (distanceKm == null || distanceKm <= 0) {
            distanceKm = 0.0;
        }
        if (mileage == null || mileage <= 0) {
            mileage = 4.0;
        }

        double fuelConsumption = distanceKm / mileage;
        BigDecimal estimatedFuelCost = BigDecimal.valueOf(fuelConsumption * dieselRate).setScale(2, RoundingMode.HALF_UP);
        
        BigDecimal estimatedProfit = shipperAmount.subtract(driverAmount).subtract(estimatedFuelCost);

        String classification = "LOW";
        if (shipperAmount.compareTo(BigDecimal.ZERO) > 0) {
            double profitPercentage = estimatedProfit.doubleValue() / shipperAmount.doubleValue();
            if (profitPercentage > 0.25) {
                classification = "GOOD";
            } else if (profitPercentage >= 0.10) {
                classification = "MEDIUM";
            }
        }

        return FuelProfitCalculationResponse.builder()
                .distanceKm(Math.round(distanceKm * 100.0) / 100.0)
                .averageMileage(mileage)
                .dieselRate(dieselRate)
                .estimatedFuelConsumption(Math.round(fuelConsumption * 100.0) / 100.0)
                .estimatedFuelCost(estimatedFuelCost)
                .estimatedProfit(estimatedProfit)
                .profitClassification(classification)
                .build();
    }

    private void validateAccess(Load load) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId).orElse(null);
        if (user == null || user.getRole() == Role.ADMIN) return;

        if (user.getRole() == Role.TRANSPORTER) {
            if (load.getTransporter() != null && !load.getTransporter().getId().equals(currentUserId)) {
                throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("You are not authorized to view this load.");
            }
        } else {
            throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("Only transporters and admins can calculate profit for unassigned loads.");
        }
    }

    private void validateAccess(Trip trip) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId).orElse(null);
        if (user == null || user.getRole() == Role.ADMIN) return;

        if (user.getRole() == Role.TRANSPORTER) {
            if (trip.getTransporter() != null && !trip.getTransporter().getId().equals(currentUserId)) {
                throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("You are not authorized to view this trip.");
            }
        } else if (user.getRole() == Role.DRIVER) {
            if (trip.getDriver() != null && !trip.getDriver().getId().equals(currentUserId)) {
                throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("You are not authorized to view this trip.");
            }
        } else {
            throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("Unauthorized role.");
        }
    }
}
