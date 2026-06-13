package com.truckmitra.service.fleet;

import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarbonTrackerService {

    private final TripRepository tripRepository;

    /**
     * Calculate Carbon Emission for a trip.
     * Formula: Distance * Weight * EmissionFactor
     * EmissionFactor for Truck ~ 0.161 kg CO2 per Ton-km (Average)
     */
    public double calculateEmission(Trip trip) {
        if (trip.getLoad() == null || trip.getDistance() == null) return 0.0;
        
        double weightInTons = trip.getLoad().getWeight();
        double distanceInKm = trip.getDistance();
        
        double factor = 0.161; // kg CO2 / (Ton * km)
        
        return weightInTons * distanceInKm * factor;
    }

    public Map<String, Double> getMonthlyEmission(Long transporterId) {
        List<Trip> trips = tripRepository.findByTransporterId(transporterId);
        
        return trips.stream()
                .filter(t -> t.getCompletedAt() != null)
                .collect(Collectors.groupingBy(
                    t -> t.getCompletedAt().getMonth().toString(),
                    Collectors.summingDouble(t -> t.getCarbonEmission() != null ? t.getCarbonEmission() : 0.0)
                ));
    }

    public Map<String, Double> getPerVehicleEmission(Long transporterId) {
        List<Trip> trips = tripRepository.findByTransporterId(transporterId);
        
        return trips.stream()
                .filter(t -> t.getVehicle() != null)
                .collect(Collectors.groupingBy(
                    t -> t.getVehicle().getVehicleNumber(),
                    Collectors.summingDouble(t -> t.getCarbonEmission() != null ? t.getCarbonEmission() : 0.0)
                ));
    }
}
