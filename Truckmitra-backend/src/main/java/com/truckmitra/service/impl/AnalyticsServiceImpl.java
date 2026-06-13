package com.truckmitra.service.impl;

import com.truckmitra.repository.*;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.repository.fleet.VehicleRepository;
import com.truckmitra.repository.load.BidRepository;
import com.truckmitra.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired private LoadRepository loadRepository;
    @Autowired private TripRepository tripRepository;
    @Autowired private BidRepository bidRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private VehicleRepository vehicleRepository;

    @Override
    public Map<String, Object> getAdminAnalytics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalLoads", loadRepository.count());
        metrics.put("totalTrips", tripRepository.count());
        metrics.put("totalBids", bidRepository.count());
        metrics.put("totalUsers", userRepository.count());
        
        // Trends (Mocked for dashboard charts)
        metrics.put("revenueTrends", new int[]{5000, 12000, 8000, 15000, 22000, 18000});
        metrics.put("loadVolumes", new int[]{10, 25, 15, 30, 45, 40});
        
        return metrics;
    }

    @Override
    public Map<String, Object> getShipperAnalytics(Long userId) {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("loadsPosted", loadRepository.countByShipperId(userId));
        metrics.put("activeTrips", tripRepository.countByShipperId(userId)); // assuming repo has this
        return metrics;
    }

    @Override
    public Map<String, Object> getTransporterAnalytics(Long userId) {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalBids", bidRepository.countByTransporterId(userId));
        metrics.put("completedTrips", tripRepository.countByTransporterId(userId)); // assuming repo has this
        metrics.put("fleetSize", driverRepository.countByTransporterId(userId) + vehicleRepository.countByTransporterId(userId));
        return metrics;
    }
}
