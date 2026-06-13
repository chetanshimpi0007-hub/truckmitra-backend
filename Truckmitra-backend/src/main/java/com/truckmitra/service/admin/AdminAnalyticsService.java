package com.truckmitra.service.admin;

import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.repository.load.BidRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final LoadRepository loadRepository;
    private final TripRepository tripRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;

    @Data
    public static class AnalyticsSummary {
        private long totalUsers;
        private long totalLoads;
        private long totalBids;
        private long totalTrips;
        private double totalRevenue;
        private Map<String, Long> statusDistribution;
    }

    public AnalyticsSummary getSummary() {
        AnalyticsSummary summary = new AnalyticsSummary();
        summary.setTotalUsers(userRepository.count());
        summary.setTotalLoads(loadRepository.count());
        summary.setTotalBids(bidRepository.count());
        summary.setTotalTrips(tripRepository.count());
        
        // Revenue is sum of COMPLETED trip amounts
        Double revenue = tripRepository.findAll().stream()
                .filter(t -> t.getStatus() != null && "COMPLETED".equals(t.getStatus().name()))
                .mapToDouble(t -> t.getFreightAmount() != null ? t.getFreightAmount().doubleValue() : 0.0)
                .sum();
        summary.setTotalRevenue(revenue);
        
        return summary;
    }
}
