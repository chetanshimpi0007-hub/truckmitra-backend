with open(r'C:\Users\Administrator\Downloads\Truckmitra project12345\Truckmitra-backend\src\main\java\com\truckmitra\service\impl\TripServiceImpl.java', 'r') as f:
    lines = f.readlines()

good_lines = lines[:873]

rest_of_file = """
        trip.setLastLocationUpdate(LocalDateTime.now());
        tripRepository.save(trip);

        com.truckmitra.entity.load.TripLocation history = com.truckmitra.entity.load.TripLocation.builder()
                .trip(trip)
                .latitude(lat)
                .longitude(lng)
                .speed(speed)
                .timestamp(LocalDateTime.now())
                .build();
        tripLocationRepository.save(history);
    }

    @Override
    public List<com.truckmitra.entity.load.TripLocation> getTrackingHistory(Long tripId) {
        return tripLocationRepository.findByTripIdOrderByTimestampAsc(tripId);
    }

    // -- QUERY METHODS ---------------------------------------------------------

    @Override
    public List<Trip> getDriverTrips(Long driverId) {
        return tripRepository.findByDriverId(driverId);
    }

    @Override
    public List<Trip> getTransporterTrips(Long transporterId) {
        return tripRepository.findByTransporterId(transporterId);
    }

    @Override
    public Trip getTripById(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found: " + tripId));
    }

    @Override
    public List<Trip> getActiveTripsForAdmin() {
        return tripRepository.findByStatusIn(List.of(
                TripStatus.DRIVER_ASSIGNED, TripStatus.ACCEPTED_BY_DRIVER,
                TripStatus.IN_TRANSIT, TripStatus.PAUSED));
    }

    @Override
    public List<Trip> getActiveTripsForShipper(Long shipperId) {
        return tripRepository.findByLoad_ShipperIdAndStatusIn(shipperId,
                List.of(TripStatus.IN_TRANSIT, TripStatus.PAUSED, TripStatus.DELIVERED));
    }

    @Override
    @Transactional
    public Trip updateTripStartPhoto(Long tripId, String photoUrl) {
        Trip trip = getTripById(tripId);
        trip.setStartPhotoUrl(photoUrl);
        return tripRepository.save(trip);
    }

    @Override
    @Transactional
    public Trip setPickupReceiptUrl(Long tripId, String pickupReceiptUrl) {
        Trip trip = getTripById(tripId);
        trip.setPickupReceiptUrl(pickupReceiptUrl);
        return tripRepository.save(trip);
    }

    // -- PRIVATE HELPERS -------------------------------------------------------

    private RouteData calculateRouteData(String source, String destination, double weightTons) {
        try {
            return osrmRouteProvider.calculateRoute(source, destination, weightTons);
        } catch (Exception e) {
            log.error("Route calculation failed, using estimation: {}", e.getMessage());
            // Return a basic estimate so the trip is not blocked
            return RouteData.builder()
                    .distanceKm(500.0)
                    .estimatedTravelTimeMins(545)
                    .tollPlazaCount(6)
                    .estimatedTollCostInr(750.0)
                    .fuelEstimateLiters(71.4)
                    .carbonEmissionKg(191.4)
                    .providerName("Fallback")
                    .build();
        }
    }

    private void applyRouteData(Trip trip, RouteData routeData) {
        trip.setDistance(routeData.getDistanceKm());
        trip.setEstimatedTravelTimeMins(routeData.getEstimatedTravelTimeMins());
        trip.setTollPlazaCount(routeData.getTollPlazaCount());
        trip.setEstimatedTollCost(routeData.getEstimatedTollCostInr());
        trip.setFuelEstimateLiters(routeData.getFuelEstimateLiters());
        trip.setCarbonEmission(routeData.getCarbonEmissionKg());
        trip.setTotalTollCost(routeData.getEstimatedTollCostInr());
        trip.setFuelCost(routeData.getFuelEstimateLiters() != null ? routeData.getFuelEstimateLiters() * 95.0 : null);
        if (routeData.getSourceLatitude() != null) {
            trip.setSourceLatitude(routeData.getSourceLatitude());
            trip.setSourceLongitude(routeData.getSourceLongitude());
        }
        if (routeData.getDestinationLatitude() != null) {
            trip.setDestinationLatitude(routeData.getDestinationLatitude());
            trip.setDestinationLongitude(routeData.getDestinationLongitude());
        }
    }

    private void sendSocketNotification(Long userId, String message, Map<String, Object> payload) {
        if (userId == null) return;
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("userId", userId);
            body.put("message", message);
            body.put("payload", payload);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForObject("http://localhost:4000/api/notify", entity, String.class);
        } catch (Exception e) {
            log.warn("Socket.io notification failed (non-blocking): {}", e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<Trip> getCompletedTrips(Long userId, String role, String search, String dateFilter, java.time.LocalDate startDate, java.time.LocalDate endDate, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.jpa.domain.Specification<Trip> spec = com.truckmitra.repository.specification.TripSpecification.getCompletedTrips(userId, role, search, dateFilter, startDate, endDate);
        return tripRepository.findAll(spec, pageable);
    }
}
"""

with open(r'C:\Users\Administrator\Downloads\Truckmitra project12345\Truckmitra-backend\src\main\java\com\truckmitra\service\impl\TripServiceImpl.java', 'w') as f:
    f.writelines(good_lines)
    f.write(rest_of_file)

print('Restored successfully')
