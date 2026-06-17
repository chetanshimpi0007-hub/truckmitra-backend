package com.truckmitra.service.transporter.impl;

import com.truckmitra.dto.response.BusinessHealthScoreResponse;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.common.enums.TripStatus;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.repository.fleet.VehicleRepository;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.service.transporter.BusinessHealthScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BusinessHealthScoreServiceImpl implements BusinessHealthScoreService {

    private final TripRepository tripRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public BusinessHealthScoreResponse calculateForTransporter(Long transporterId) {
        List<String> recommendations = new ArrayList<>();

        // 1. Driver Utilization (25%)
        long totalDrivers = driverRepository.countByTransporterId(transporterId);
        long driversOnTrip = 0;
        List<Object[]> driverStatuses = driverRepository.countDriverStatusesForTransporter(transporterId);
        for (Object[] statusCount : driverStatuses) {
            String status = statusCount[0] != null ? statusCount[0].toString() : "";
            if ("ON_TRIP".equals(status)) {
                driversOnTrip = ((Number) statusCount[1]).longValue();
            }
        }
        
        int driverUtilScore = 100;
        if (totalDrivers > 0) {
            double ratio = (double) driversOnTrip / totalDrivers;
            driverUtilScore = (int) (ratio * 100);
            if (driverUtilScore < 60) {
                recommendations.add("Several drivers are idle. Increase assignments.");
            }
        }

        // 2. Fleet Utilization (20%)
        long totalVehicles = vehicleRepository.countByTransporterId(transporterId);
        // Approximate active vehicles by currently active trips
        List<TripStatus> activeStatuses = List.of(TripStatus.IN_TRANSIT, TripStatus.ASSIGNED);
        List<Trip> activeTrips = tripRepository.findByTransporterId(transporterId).stream()
                .filter(t -> activeStatuses.contains(t.getStatus()))
                .toList();
        long activeVehicles = activeTrips.size();

        int fleetUtilScore = 100;
        if (totalVehicles > 0) {
            double ratio = (double) activeVehicles / totalVehicles;
            fleetUtilScore = Math.min(100, (int) (ratio * 100)); // Can be > 100 if multiple trips per vehicle but bounded
            if (fleetUtilScore < 70) {
                recommendations.add("Multiple vehicles remain unused.");
            }
        }

        // 3. POD Compliance (25%) & 4. Return Load & Profitability
        List<Trip> completedTrips = tripRepository.findByTransporterId(transporterId).stream()
                .filter(t -> TripStatus.COMPLETED.equals(t.getStatus()))
                .toList();
        
        int podScore = 100;
        int returnLoadScore = 50; // Neutral default
        int profitScore = 100;

        if (!completedTrips.isEmpty()) {
            // POD Compliance
            long approvedPODs = completedTrips.stream()
                    .filter(t -> t.getPodUrl() != null && !t.getPodUrl().isEmpty())
                    .count();
            podScore = (int) (((double) approvedPODs / completedTrips.size()) * 100);
            if (podScore < 85) {
                recommendations.add("POD uploads are delayed or pending approval. Follow up with drivers.");
            }

            // Profitability estimate (simplified: avg margin against target 10000)
            BigDecimal totalProfit = BigDecimal.ZERO;
            for (Trip t : completedTrips) {
                if (t.getFreightAmount() != null && t.getDriverAmount() != null) {
                    BigDecimal margin = t.getFreightAmount().subtract(t.getDriverAmount());
                    totalProfit = totalProfit.add(margin);
                }
            }
            BigDecimal avgProfit = totalProfit.divide(new BigDecimal(completedTrips.size()), java.math.RoundingMode.HALF_UP);
            if (avgProfit.compareTo(new BigDecimal("10000")) < 0) {
                profitScore = 60;
                recommendations.add("Average trip profitability is below target.");
            } else {
                profitScore = 90;
            }
        } else {
            recommendations.add("Complete more trips to generate robust health metrics.");
        }

        // Calculate Overall Score
        int overallScore = (int) (
                (podScore * 0.25) +
                (driverUtilScore * 0.25) +
                (fleetUtilScore * 0.20) +
                (returnLoadScore * 0.15) +
                (profitScore * 0.15)
        );

        String grade;
        if (overallScore >= 90) grade = "A+";
        else if (overallScore >= 80) grade = "A";
        else if (overallScore >= 70) grade = "B";
        else if (overallScore >= 60) grade = "C";
        else grade = "D";

        if (recommendations.isEmpty()) {
            recommendations.add("Excellent performance across all operational metrics.");
        }

        return BusinessHealthScoreResponse.builder()
                .overallScore(overallScore)
                .grade(grade)
                .podComplianceScore(podScore)
                .driverUtilizationScore(driverUtilScore)
                .fleetUtilizationScore(fleetUtilScore)
                .returnLoadScore(returnLoadScore)
                .profitabilityScore(profitScore)
                .recommendations(recommendations)
                .build();
    }
}
