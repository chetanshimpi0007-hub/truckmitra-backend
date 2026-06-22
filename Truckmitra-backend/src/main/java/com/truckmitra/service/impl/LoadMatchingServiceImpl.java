package com.truckmitra.service.impl;

import com.truckmitra.dto.MatchScoreDTO;
import com.truckmitra.dto.RecommendationDTO;
import com.truckmitra.entity.common.enums.BidStatus;
import com.truckmitra.entity.common.enums.TripStatus;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.load.LoadRecommendation;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.entity.user.TransporterPreference;
import com.truckmitra.entity.user.User;
import com.truckmitra.enums.NotificationType;
import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.repository.load.BidRepository;
import com.truckmitra.repository.load.LoadRecommendationRepository;
import com.truckmitra.repository.user.TransporterPreferenceRepository;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.service.InAppNotificationService;
import com.truckmitra.service.LoadMatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoadMatchingServiceImpl implements LoadMatchingService {

    private final LoadRepository loadRepository;
    private final TransporterRepository transporterRepository;
    private final TransporterPreferenceRepository preferenceRepository;
    private final LoadRecommendationRepository recommendationRepository;
    private final BidRepository bidRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final InAppNotificationService inAppNotificationService;

    @Override
    public MatchScoreDTO calculateMatchScore(Long loadId, Long transporterId) {
        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found: " + loadId));
        Transporter transporter = transporterRepository.findById(transporterId)
                .orElseThrow(() -> new RuntimeException("Transporter not found: " + transporterId));
        TransporterPreference preference = preferenceRepository.findByTransporterId(transporterId)
                .orElse(null);

        return computeScore(load, transporter, preference);
    }

    private MatchScoreDTO computeScore(Load load, Transporter transporter, TransporterPreference preference) {
        Map<String, Double> factorScores = new HashMap<>();
        List<String> reasons = new ArrayList<>();

        // 1. Pickup Proximity (Weight 15%)
        double proximityScore = 30.0;
        if (preference != null && listContainsIgnoreCase(preference.getPreferredPickupCities(), load.getSource())) {
            proximityScore = 100.0;
            reasons.add("Nearby load (Preferred pickup city)");
        } else if (transporter.getCity() != null && transporter.getCity().equalsIgnoreCase(load.getSource())) {
            proximityScore = 85.0;
            reasons.add("Nearby load (Registered city)");
        }
        factorScores.put("pickupProximity", proximityScore);

        // 2. Destination Similarity (Weight 15%)
        double destScore = 30.0;
        if (preference != null && listContainsIgnoreCase(preference.getPreferredDestinationCities(), load.getDestination())) {
            destScore = 100.0;
            reasons.add("Preferred destination route");
        }
        factorScores.put("destinationSimilarity", destScore);

        // 3. Vehicle Compatibility (Weight 15%)
        double vehicleScore = 30.0;
        if (preference != null && listContainsIgnoreCase(preference.getVehicleTypes(), load.getMaterialType())) {
            vehicleScore = 100.0;
            reasons.add("Vehicle compatible");
        } else if (load.getMaterialType() != null && transporter.getAgencyName() != null) {
            // Default matching based on generic transporter agency matches
            vehicleScore = 70.0;
        }
        factorScores.put("vehicleCompatibility", vehicleScore);

        // 4. Weight Compatibility (Weight 10%)
        double weightScore = 50.0;
        if (preference != null) {
            Double minW = preference.getMinWeight();
            Double maxW = preference.getMaxWeight();
            if (minW != null && maxW != null) {
                if (load.getWeight() >= minW && load.getWeight() <= maxW) {
                    weightScore = 100.0;
                    reasons.add("Optimal load weight");
                } else {
                    weightScore = 20.0;
                }
            } else {
                weightScore = 70.0;
            }
        }
        factorScores.put("weightCompatibility", weightScore);

        // 5. Historical Bid Success (Weight 10%)
        double bidScore = 50.0;
        long totalBids = bidRepository.countByTransporterId(transporter.getId());
        if (totalBids > 0) {
            long wonBids = bidRepository.findByTransporterIdAndStatus(transporter.getId(), BidStatus.ACCEPTED).size();
            bidScore = ((double) wonBids / totalBids) * 100.0;
            if (bidScore >= 60) {
                reasons.add("High bid success ratio");
            }
        }
        factorScores.put("historicalBidSuccess", bidScore);

        // 6. Trip Completion Ratio (Weight 10%)
        double completionScore = 70.0;
        List<Trip> trips = tripRepository.findByTransporterId(transporter.getId());
        if (!trips.isEmpty()) {
            long completed = trips.stream().filter(t -> t.getStatus() == TripStatus.COMPLETED).count();
            completionScore = ((double) completed / trips.size()) * 100.0;
            if (completionScore >= 80) {
                reasons.add("High completion ratio");
            }
        }
        factorScores.put("tripCompletionRatio", completionScore);

        // 7. Driver Ratings (Weight 5%)
        double driverScore = 60.0;
        if (transporter.getAverageDriverRating() != null && transporter.getAverageDriverRating() > 0) {
            driverScore = (transporter.getAverageDriverRating() / 5.0) * 100.0;
            if (driverScore >= 80) {
                reasons.add("Highly rated drivers");
            }
        }
        factorScores.put("driverRatings", driverScore);

        // 8. Preferred Routes (Weight 10%)
        double routeScore = 30.0;
        if (preference != null && preference.getPreferredRoutes() != null) {
            String cleanRoute = (load.getSource() + "-" + load.getDestination()).toLowerCase().replaceAll("\\s+", "");
            String reverseRoute = (load.getDestination() + "-" + load.getSource()).toLowerCase().replaceAll("\\s+", "");
            String prefRoutes = preference.getPreferredRoutes().toLowerCase().replaceAll("\\s+", "");
            if (prefRoutes.contains(cleanRoute) || prefRoutes.contains(reverseRoute)) {
                routeScore = 100.0;
                reasons.add("Preferred route match");
            }
        }
        factorScores.put("preferredRoutes", routeScore);

        // 9. Subscription Priority (Weight 5%)
        double subScore = 50.0;
        if (transporter.getSubscriptionPlan() != null) {
            String plan = transporter.getSubscriptionPlan().toUpperCase();
            if (plan.contains("PREMIUM") || plan.contains("VIP")) {
                subScore = 100.0;
                reasons.add("Priority support subscription");
            } else if (plan.contains("GOLD") || plan.contains("BUSINESS")) {
                subScore = 80.0;
            }
        }
        factorScores.put("subscriptionPriority", subScore);

        // 10. Recent Activity (Weight 5%)
        double recentScore = 50.0;
        if (transporter.getLastLoginAt() != null) {
            if (transporter.getLastLoginAt().isAfter(LocalDateTime.now().minusDays(3))) {
                recentScore = 100.0;
            } else if (transporter.getLastLoginAt().isAfter(LocalDateTime.now().minusDays(7))) {
                recentScore = 80.0;
            }
        }
        factorScores.put("recentActivity", recentScore);

        // Compute Weighted Score
        double rawScore = (proximityScore * 0.15) + (destScore * 0.15) + (vehicleScore * 0.15)
                + (weightScore * 0.10) + (bidScore * 0.10) + (completionScore * 0.10)
                + (driverScore * 0.05) + (routeScore * 0.10) + (subScore * 0.05)
                + (recentScore * 0.05);

        // Confidence calculation (based on preference completeness)
        double confidence = 50.0;
        if (preference != null) {
            int filledFields = 0;
            if (preference.getPreferredPickupCities() != null) filledFields++;
            if (preference.getPreferredDestinationCities() != null) filledFields++;
            if (preference.getVehicleTypes() != null) filledFields++;
            if (preference.getPreferredRoutes() != null) filledFields++;
            if (preference.getMinWeight() != null) filledFields++;
            confidence = 50.0 + (filledFields * 10.0); // ranges up to 100%
        }

        if (reasons.isEmpty()) {
            reasons.add("General load recommendation");
        }

        return MatchScoreDTO.builder()
                .score(Math.round(rawScore * 10.0) / 10.0)
                .confidence(confidence)
                .reasons(reasons.stream().distinct().collect(Collectors.toList()))
                .factorScores(factorScores)
                .build();
    }

    private boolean listContainsIgnoreCase(String listStr, String query) {
        if (listStr == null || query == null) return false;
        String[] items = listStr.split(",");
        for (String item : items) {
            if (item.trim().equalsIgnoreCase(query.trim())) {
                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional
    public void processNewLoad(Long loadId) {
        Load load = loadRepository.findById(loadId).orElse(null);
        if (load == null) return;

        List<Transporter> transporters = transporterRepository.findAll();
        for (Transporter transporter : transporters) {
            try {
                // Prevent duplicate recommendation check
                Optional<LoadRecommendation> existing = recommendationRepository.findByLoadIdAndTransporterId(loadId, transporter.getId());
                if (existing.isPresent()) continue;

                MatchScoreDTO match = calculateMatchScore(loadId, transporter.getId());
                
                LoadRecommendation rec = LoadRecommendation.builder()
                        .loadId(loadId)
                        .transporterId(transporter.getId())
                        .matchScore(match.getScore())
                        .confidencePercentage(match.getConfidence())
                        .recommendationReason(String.join(", ", match.getReasons()))
                        .status("PENDING")
                        .build();

                recommendationRepository.save(rec);

                // Real-time WebSocket, in-app & FCM Alert on Match Score > 80
                if (match.getScore() > 80.0) {
                    inAppNotificationService.sendNotification(
                            transporter.getId(),
                            "High-Score Load Recommendation Found",
                            "Load from " + load.getSource() + " to " + load.getDestination() + " matches your profile with a score of " + match.getScore() + "%.",
                            NotificationType.LOAD,
                            loadId
                    );
                }
            } catch (Exception e) {
                log.error("Failed to generate recommendation for load {} and transporter {}", loadId, transporter.getId(), e);
            }
        }
    }

    @Override
    public List<RecommendationDTO> getRecommendationsForTransporter(Long transporterId) {
        List<LoadRecommendation> recs = recommendationRepository.findByTransporterIdOrderByMatchScoreDesc(transporterId);
        return recs.stream()
                .map(r -> {
                    Load load = loadRepository.findById(r.getLoadId()).orElse(null);
                    if (load == null) return null;
                    return RecommendationDTO.builder()
                            .id(r.getId())
                            .loadId(r.getLoadId())
                            .transporterId(r.getTransporterId())
                            .matchScore(r.getMatchScore())
                            .confidencePercentage(r.getConfidencePercentage())
                            .reasons(Arrays.asList(r.getRecommendationReason().split(",\\s*")))
                            .status(r.getStatus())
                            .createdAt(r.getCreatedAt())
                            .source(load.getSource())
                            .destination(load.getDestination())
                            .weight(load.getWeight())
                            .materialType(load.getMaterialType())
                            .budget(load.getBudget())
                            .pickupDate(load.getPickupDate())
                            .estimatedDistanceKm(load.getEstimatedDistanceKm())
                            .isBiddingEnabled(load.getIsBiddingEnabled())
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    public List<RecommendationDTO> getRecommendationsForLoad(Long loadId, Long requesterUserId) {
        // Validate shipper ownership or admin permission
        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found"));
        User user = userRepository.findById(requesterUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
            if (load.getShipper() == null || !load.getShipper().getId().equals(requesterUserId)) {
                throw new RuntimeException("Unauthorized: You do not own this load.");
            }
        } else if (user.getRole() != com.truckmitra.entity.common.enums.Role.ADMIN) {
            throw new RuntimeException("Unauthorized role to request recommendations for a load.");
        }

        List<LoadRecommendation> recs = recommendationRepository.findByLoadIdOrderByMatchScoreDesc(loadId);
        return recs.stream()
                .map(r -> {
                    Transporter trans = transporterRepository.findById(r.getTransporterId()).orElse(null);
                    if (trans == null) return null;
                    return RecommendationDTO.builder()
                            .id(r.getId())
                            .loadId(r.getLoadId())
                            .transporterId(r.getTransporterId())
                            .matchScore(r.getMatchScore())
                            .confidencePercentage(r.getConfidencePercentage())
                            .reasons(Arrays.asList(r.getRecommendationReason().split(",\\s*")))
                            .status(r.getStatus())
                            .createdAt(r.getCreatedAt())
                            .agencyName(trans.getAgencyName())
                            .transporterName(trans.getFullName())
                            .transporterRating(trans.getAverageRating())
                            .fleetSize(trans.getFleetSize())
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransporterPreference saveOrUpdatePreference(Long transporterId, TransporterPreference prefData) {
        TransporterPreference preference = preferenceRepository.findByTransporterId(transporterId)
                .orElse(new TransporterPreference());

        preference.setTransporterId(transporterId);
        preference.setPreferredPickupCities(prefData.getPreferredPickupCities());
        preference.setPreferredDestinationCities(prefData.getPreferredDestinationCities());
        preference.setVehicleTypes(prefData.getVehicleTypes());
        preference.setMinWeight(prefData.getMinWeight());
        preference.setMaxWeight(prefData.getMaxWeight());
        preference.setPreferredRoutes(prefData.getPreferredRoutes());
        preference.setMaxDistanceRadius(prefData.getMaxDistanceRadius());
        preference.setPreferredTripFrequency(prefData.getPreferredTripFrequency());
        preference.setActive(prefData.getActive() != null ? prefData.getActive() : true);

        return preferenceRepository.save(preference);
    }

    @Override
    public TransporterPreference getPreference(Long transporterId) {
        return preferenceRepository.findByTransporterId(transporterId)
                .orElseThrow(() -> new RuntimeException("Preferences not set for transporter id " + transporterId));
    }
}
