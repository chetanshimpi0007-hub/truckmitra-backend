package com.truckmitra.service.user.impl;

import com.truckmitra.dto.response.DriverAvailabilitySummaryResponse;
import com.truckmitra.entity.common.enums.DriverAvailabilityStatus;
import com.truckmitra.entity.user.Driver;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.service.user.DriverAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverAvailabilityServiceImpl implements DriverAvailabilityService {

    private final DriverRepository driverRepository;

    @Override
    public DriverAvailabilitySummaryResponse getAvailabilitySummary(Long transporterId) {
        List<Object[]> statusCounts = driverRepository.countDriverStatusesForTransporter(transporterId);
        
        long available = 0;
        long onTrip = 0;
        long offline = 0;

        for (Object[] row : statusCounts) {
            DriverAvailabilityStatus status = (DriverAvailabilityStatus) row[0];
            Long count = ((Number) row[1]).longValue();
            
            if (status == DriverAvailabilityStatus.AVAILABLE) available = count;
            else if (status == DriverAvailabilityStatus.ON_TRIP) onTrip = count;
            else if (status == DriverAvailabilityStatus.OFFLINE) offline = count;
        }

        List<Object[]> cityCounts = driverRepository.countAvailableDriversByCityForTransporter(transporterId);
        Map<String, Long> cityMap = new HashMap<>();
        for (Object[] row : cityCounts) {
            String city = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            cityMap.put(city, count);
        }

        return DriverAvailabilitySummaryResponse.builder()
                .availableDriversCount(available)
                .onTripDriversCount(onTrip)
                .offlineDriversCount(offline)
                .cityWiseAvailableDrivers(cityMap)
                .build();
    }

    @Override
    public Page<Driver> getAvailableDrivers(Long transporterId, String city, String vehicleType, Pageable pageable) {
        // Find all available drivers for the given transporter
        List<Driver> availableDrivers = driverRepository.findAvailableDriversByTransporter(transporterId);

        // Apply dynamic filtering if present
        List<Driver> filtered = availableDrivers.stream()
                .filter(d -> city == null || city.equalsIgnoreCase(d.getCity()))
                .filter(d -> vehicleType == null || (d.getPreferredVehicleType() != null && vehicleType.equalsIgnoreCase(d.getPreferredVehicleType().name())))
                .collect(Collectors.toList());

        // Implement simple memory pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        
        if (start > filtered.size()) {
            return new PageImpl<>(List.of(), pageable, filtered.size());
        }

        return new PageImpl<>(filtered.subList(start, end), pageable, filtered.size());
    }
}
