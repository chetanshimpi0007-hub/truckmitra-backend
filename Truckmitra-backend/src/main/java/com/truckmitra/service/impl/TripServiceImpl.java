// src/main/java/com/truckmitra/service/impl/TripServiceImpl.java
package com.truckmitra.service.impl;

import com.truckmitra.dto.RouteData;
import com.truckmitra.entity.common.enums.LoadStatus;
import com.truckmitra.entity.common.enums.TripStatus;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.user.Driver;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.service.TripService;
import com.truckmitra.service.route.OsrmRouteProvider;
import com.truckmitra.service.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final LoadRepository loadRepository;
    private final DriverRepository driverRepository;
    private final com.truckmitra.repository.fleet.VehicleRepository vehicleRepository;
    private final com.truckmitra.repository.load.BidRepository bidRepository;
    private final CalculationServiceImpl calculationService;
    private final WalletService walletService;

    private final com.truckmitra.repository.load.PODRepository podRepository;
    private final com.truckmitra.repository.load.TripLocationRepository tripLocationRepository;
    private final com.truckmitra.service.notification.NotificationService notificationService;
    private final com.truckmitra.service.NotificationService emailNotificationService;
    private final com.truckmitra.service.LRService lrService;
    private final com.truckmitra.repository.load.DriverAssignmentRepository driverAssignmentRepository;
    private final com.truckmitra.repository.load.ReceiptVerificationRepository receiptVerificationRepository;
    private final com.truckmitra.repository.auth.UserRepository userRepository;
    private final com.truckmitra.repository.user.TransporterRepository transporterRepository;
    private final com.truckmitra.service.PdfService pdfService;
    private final com.truckmitra.service.CloudinaryService cloudinaryService;
    private final com.truckmitra.repository.TripPhotoRepository tripPhotoRepository;
    private final OsrmRouteProvider osrmRouteProvider;

    @Override
    @Transactional
    public Trip createInitialTrip(Long loadId, Long bidId) {
        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found"));
        com.truckmitra.entity.load.Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        String tripNumber = "TRP-" + java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")
                .format(java.time.LocalDateTime.now()) + "-" + java.util.UUID.randomUUID().toString()
                .substring(0, 8).toUpperCase();

        double weight = load.getWeight() != null ? load.getWeight() : 1.0;

        // Calculate route intelligence at trip creation
        RouteData routeData = calculateRouteData(load.getSource(), load.getDestination(), weight);

        Trip trip = Trip.builder()
                .tripNumber(tripNumber)
                .load(load)
                .bid(bid)
                .shipper(load.getShipper())
                .transporter(bid.getTransporter())
                .source(load.getSource())
                .destination(load.getDestination())
                .distance(routeData.getDistanceKm())
                .freightAmount(bid.getAmount())
                .carbonEmission(routeData.getCarbonEmissionKg())
                .totalTollCost(routeData.getEstimatedTollCostInr())
                .fuelCost(routeData.getFuelEstimateLiters() != null ? routeData.getFuelEstimateLiters() * 95.0 : null)
                .estimatedTravelTimeMins(routeData.getEstimatedTravelTimeMins())
                .tollPlazaCount(routeData.getTollPlazaCount())
                .estimatedTollCost(routeData.getEstimatedTollCostInr())
                .fuelEstimateLiters(routeData.getFuelEstimateLiters())
                .sourceLatitude(routeData.getSourceLatitude())
                .sourceLongitude(routeData.getSourceLongitude())
                .destinationLatitude(routeData.getDestinationLatitude())
                .destinationLongitude(routeData.getDestinationLongitude())
                .pickupDate(load.getPickupDate())
                .status(TripStatus.ASSIGNED)
                .locationEnabled(false)
                .build();

        Trip savedTrip = tripRepository.save(trip);

        // Auto-generate Trip PDF after creation
        try {
            byte[] pdfBytes = pdfService.generateTripPdf(savedTrip);
            String pdfUrl = cloudinaryService.uploadBytes(pdfBytes, "trip_" + savedTrip.getTripNumber());
            savedTrip.setTripPdfUrl(pdfUrl);
            savedTrip = tripRepository.save(savedTrip);
        } catch (Exception e) {
            log.error("Failed to auto-generate trip PDF: {}", e.getMessage(), e);
        }

        return savedTrip;
    }

    // ── DIRECT ASSIGNMENT (TRANSPORTER) ───────────────────────────────────────

    @Override
    @Transactional
    public Trip assignDirectTransporterLoad(Long loadId, Long driverId, Long vehicleId) {
        Long userId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        com.truckmitra.entity.user.Transporter transporter = transporterRepository.findById(userId)
                .orElseThrow(() -> new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("Transporter not found"));

        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found"));

        if (load.getTransporter() == null || !load.getTransporter().getId().equals(transporter.getId())) {
            throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("You are not authorized to assign drivers to this load.");
        }

        com.truckmitra.entity.user.Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (!driver.getTransporterId().equals(transporter.getId())) {
            throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("Driver does not belong to your fleet.");
        }

        if (!Boolean.TRUE.equals(driver.getIsAvailable()) || Boolean.TRUE.equals(driver.getIsOnTrip())) {
            throw new RuntimeException("Driver is currently unavailable or on another trip.");
        }

        com.truckmitra.entity.fleet.Vehicle vehicle = null;
        if (vehicleId != null) {
            vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            if (!vehicle.getTransporter().getId().equals(transporter.getId())) {
                throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("Vehicle does not belong to your fleet.");
            }
            if (!Boolean.TRUE.equals(vehicle.getIsAvailable())) {
                throw new RuntimeException("Vehicle is currently unavailable.");
            }
            vehicle.setIsAvailable(false);
            vehicleRepository.save(vehicle);
        }

        driver.setIsAvailable(false);
        driverRepository.save(driver);

        String tripNumber = "TRP-" + java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")
                .format(java.time.LocalDateTime.now()) + "-" + java.util.UUID.randomUUID().toString()
                .substring(0, 8).toUpperCase();

        double weight = load.getWeight() != null ? load.getWeight() : 1.0;
        RouteData routeData = calculateRouteData(load.getSource(), load.getDestination(), weight);

        Trip trip = Trip.builder()
                .tripNumber(tripNumber)
                .load(load)
                .transporter(transporter)
                .driver(driver)
                .vehicle(vehicle)
                .source(load.getSource())
                .destination(load.getDestination())
                .distance(routeData.getDistanceKm())
                .freightAmount(load.getBudget() != null ? load.getBudget() : java.math.BigDecimal.ZERO)
                .carbonEmission(routeData.getCarbonEmissionKg())
                .totalTollCost(routeData.getEstimatedTollCostInr())
                .fuelCost(routeData.getFuelEstimateLiters() != null ? routeData.getFuelEstimateLiters() * 95.0 : null)
                .estimatedTravelTimeMins(routeData.getEstimatedTravelTimeMins())
                .tollPlazaCount(routeData.getTollPlazaCount())
                .estimatedTollCost(routeData.getEstimatedTollCostInr())
                .fuelEstimateLiters(routeData.getFuelEstimateLiters())
                .sourceLatitude(routeData.getSourceLatitude())
                .sourceLongitude(routeData.getSourceLongitude())
                .destinationLatitude(routeData.getDestinationLatitude())
                .destinationLongitude(routeData.getDestinationLongitude())
                .pickupDate(load.getPickupDate())
                .status(TripStatus.ASSIGNED)
                .locationEnabled(false)
                .build();

        Trip savedTrip = tripRepository.save(trip);

        load.setStatus(com.truckmitra.entity.common.enums.LoadStatus.ASSIGNED);
        loadRepository.save(load);

        // Notify driver
        notificationService.sendNotification(
                driver.getId(),
                "New Trip Assigned: #" + savedTrip.getTripNumber() + ". Please accept or reject.",
                com.truckmitra.enums.ChannelType.PUSH
        );

        try {
            byte[] pdfBytes = pdfService.generateTripPdf(savedTrip);
            String pdfUrl = cloudinaryService.uploadBytes(pdfBytes, "trip_" + savedTrip.getTripNumber());
            savedTrip.setTripPdfUrl(pdfUrl);
            savedTrip = tripRepository.save(savedTrip);
        } catch (Exception e) {
            log.error("Failed to auto-generate trip PDF: {}", e.getMessage(), e);
        }

        return savedTrip;
    }

    // ── VEHICLE ASSIGNMENT ────────────────────────────────────────────────────

    @Override
    @Transactional
    public Trip assignVehicle(Long tripId, Long vehicleId) {
        Trip trip = getTripById(tripId);
        com.truckmitra.entity.fleet.Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (!Boolean.TRUE.equals(vehicle.getIsAvailable())) {
            throw new RuntimeException("Vehicle is already on an active trip");
        }

        if (vehicle.getInsuranceExpiry() != null && vehicle.getInsuranceExpiry().isBefore(java.time.LocalDate.now())) {
            throw new RuntimeException("Vehicle insurance has expired");
        }

        trip.setVehicle(vehicle);
        trip.setStatus(TripStatus.VEHICLE_ASSIGNED);
        vehicle.setIsAvailable(false);
        vehicleRepository.save(vehicle);

        return tripRepository.save(trip);
    }

    // ── DRIVER ASSIGNMENT ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public Trip assignDriver(Long tripId, Long driverId) {
        Trip trip = getTripById(tripId);
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (driver.getIsOnTrip() != null && driver.getIsOnTrip()) {
            throw new RuntimeException("Driver is already on an active trip");
        }

        // Cancel previous pending assignments
        java.util.List<com.truckmitra.entity.load.DriverAssignment> oldAssignments =
                driverAssignmentRepository.findByTripId(tripId);
        for (com.truckmitra.entity.load.DriverAssignment oldAssign : oldAssignments) {
            if (oldAssign.getStatus() == com.truckmitra.entity.common.enums.DriverAssignmentStatus.PENDING) {
                oldAssign.setStatus(com.truckmitra.entity.common.enums.DriverAssignmentStatus.REJECTED);
                oldAssign.setRespondedAt(java.time.LocalDateTime.now());
                oldAssign.setRemarks("Cancelled due to re-assignment");
                driverAssignmentRepository.save(oldAssign);
            }
        }

        // Create new driver assignment record
        com.truckmitra.entity.load.DriverAssignment assignment = com.truckmitra.entity.load.DriverAssignment.builder()
                .trip(trip)
                .driver(driver)
                .status(com.truckmitra.entity.common.enums.DriverAssignmentStatus.PENDING)
                .assignedAt(java.time.LocalDateTime.now())
                .remarks("Assigned by transporter")
                .build();
        driverAssignmentRepository.save(assignment);

        trip.setDriver(driver);
        trip.setStatus(TripStatus.ASSIGNED);
        driver.setIsOnTrip(true);
        driverRepository.save(driver);

        // Notify driver of new assignment
        try {
            notificationService.sendNotification(driver.getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message",
                            "New Trip Assigned: #" + trip.getTripNumber() + ". Please accept or reject."),
                    "Trip Assigned");

            // Email with PDF
            byte[] pdfBytes = pdfService.generateTripPdf(trip);
            String driverEmail = driver.getEmail();
            if (driverEmail != null && !driverEmail.isEmpty()) {
                emailNotificationService.sendEmailWithAttachment(
                        driverEmail,
                        "New Trip Assignment: #" + trip.getTripNumber(),
                        "Hello " + driver.getFullName() + ",\n\nYou have been assigned to trip #"
                                + trip.getTripNumber() + ".\nFrom: " + trip.getSource()
                                + "\nTo: " + trip.getDestination()
                                + "\n\nPlease accept or reject within 24 hours.",
                        "Trip_" + trip.getTripNumber() + ".pdf",
                        pdfBytes);
            }
        } catch (Exception e) {
            log.error("Failed to send assignment notification to driver: {}", e.getMessage());
        }

        return tripRepository.save(trip);
    }

    // ── FLEET ASSIGNMENT ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public Trip assignFleet(Long tripId, Long driverId, Long vehicleId) {
        com.truckmitra.entity.fleet.Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        com.truckmitra.entity.user.Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        if (vehicle.getDriver() != null && !vehicle.getDriver().getId().equals(driverId)) {
            throw new RuntimeException("Cannot assign a vehicle that is mapped to another driver.");
        }
        assignVehicle(tripId, vehicleId);
        vehicle.setDriver(driver);
        vehicleRepository.save(vehicle);
        return assignDriver(tripId, driverId);
    }

    // ── DRIVER ACCEPTS ASSIGNMENT ─────────────────────────────────────────────

    @Override
    @Transactional
    public Trip acceptTripAssignment(Long tripId) {
        Trip trip = getTripById(tripId);
        if (trip.getStatus() != TripStatus.ASSIGNED) {
            throw new RuntimeException("Trip is not in ASSIGNED status. Current: " + trip.getStatus());
        }
        if (trip.getDriver() == null) {
            throw new RuntimeException("No driver assigned to this trip");
        }

        double weight = trip.getLoad() != null && trip.getLoad().getWeight() != null
                ? trip.getLoad().getWeight() : 1.0;

        // Calculate fresh route data (more accurate with confirmed endpoints)
        RouteData routeData = calculateRouteData(trip.getSource(), trip.getDestination(), weight);
        applyRouteData(trip, routeData);

        // Update assignment record
        driverAssignmentRepository.findFirstByTripIdAndDriverIdOrderByCreatedAtDesc(tripId, trip.getDriver().getId())
                .ifPresent(assignment -> {
                    assignment.setStatus(com.truckmitra.entity.common.enums.DriverAssignmentStatus.ACCEPTED);
                    assignment.setRespondedAt(java.time.LocalDateTime.now());
                    assignment.setRemarks("Accepted by driver");
                    driverAssignmentRepository.save(assignment);
                });

        trip.setStatus(TripStatus.ACCEPTED);

        // Generate Assignment PDF and upload to Cloudinary
        try {
            byte[] pdfBytes = pdfService.generateAssignmentPdf(trip, routeData);
            String pdfUrl = cloudinaryService.uploadBytes(pdfBytes, "assignment_" + trip.getTripNumber());
            trip.setAssignmentPdfUrl(pdfUrl);
            log.info("Assignment PDF generated and uploaded for trip {}: {}", tripId, pdfUrl);
        } catch (Exception e) {
            log.error("Failed to generate Assignment PDF for trip {}: {}", tripId, e.getMessage(), e);
        }

        // Auto-generate Digital LR
        try {
            lrService.generateLR(tripId);
        } catch (Exception e) {
            log.error("Failed to generate LR for trip {}: {}", tripId, e.getMessage());
        }

        Trip savedTrip = tripRepository.save(trip);

        // Notify transporter
        try {
            notificationService.sendNotification(trip.getTransporter().getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message",
                            "Driver " + trip.getDriver().getFullName() + " accepted trip #" + trip.getTripNumber()),
                    "Trip Accepted");
        } catch (Exception e) {
            log.error("Failed to notify transporter on accept: {}", e.getMessage());
        }

        return savedTrip;
    }

    // ── DRIVER REJECTS ASSIGNMENT ─────────────────────────────────────────────

    @Override
    @Transactional
    public Trip rejectTripAssignment(Long tripId) {
        Trip trip = getTripById(tripId);
        Driver driver = trip.getDriver();

        if (driver != null) {
            driverAssignmentRepository.findFirstByTripIdAndDriverIdOrderByCreatedAtDesc(tripId, driver.getId())
                    .ifPresent(assignment -> {
                        assignment.setStatus(com.truckmitra.entity.common.enums.DriverAssignmentStatus.REJECTED);
                        assignment.setRespondedAt(java.time.LocalDateTime.now());
                        assignment.setRemarks("Rejected by driver");
                        driverAssignmentRepository.save(assignment);
                    });
        }

        trip.setStatus(TripStatus.REJECTED_BY_DRIVER);

        // Reset driver and vehicle so transporter can re-assign
        if (trip.getDriver() != null) {
            trip.getDriver().setIsOnTrip(false);
            driverRepository.save(trip.getDriver());
            trip.setDriver(null);
        }
        if (trip.getVehicle() != null) {
            trip.getVehicle().setIsAvailable(true);
            vehicleRepository.save(trip.getVehicle());
            trip.setVehicle(null);
        }

        Trip savedTrip = tripRepository.save(trip);

        // Notify transporter
        try {
            String driverName = driver != null ? driver.getFullName() : "Driver";
            notificationService.sendNotification(trip.getTransporter().getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message",
                            driverName + " rejected trip #" + trip.getTripNumber() + ". Please re-assign."),
                    "Trip Rejected By Driver");
        } catch (Exception e) {
            log.error("Failed to notify transporter on reject: {}", e.getMessage());
        }

        return savedTrip;
    }

    // ── SET LOCATION ENABLED ──────────────────────────────────────────────────

    @Override
    @Transactional
    public Trip setLocationEnabled(Long tripId) {
        Trip trip = getTripById(tripId);
        trip.setLocationEnabled(true);
        return tripRepository.save(trip);
    }

    // ── START TRIP (legacy, no validation) ───────────────────────────────────

    @Override
    @Transactional
    public Trip startTrip(Long tripId) {
        return startTripWithValidation(tripId);
    }

    // ── START TRIP WITH VALIDATION ────────────────────────────────────────────

    @Override
    @Transactional
    public Trip startTripWithValidation(Long tripId) {
        Trip trip = getTripById(tripId);

        if (trip.getVehicle() == null || trip.getDriver() == null) {
            throw new RuntimeException("Cannot start trip without assigned vehicle and driver");
        }
        if (trip.getStatus() != TripStatus.ACCEPTED) {
            throw new RuntimeException("Driver must accept assignment before starting trip. Current status: " + trip.getStatus());
        }
        if (trip.getPickupReceiptUrl() == null || trip.getPickupReceiptUrl().isBlank()) {
            throw new RuntimeException("Pickup receipt must be uploaded before starting the trip");
        }
        if (!Boolean.TRUE.equals(trip.getLocationEnabled())) {
            throw new RuntimeException("GPS location must be enabled before starting the trip");
        }

        trip.setStatus(TripStatus.STARTED);
        trip.setStartedAt(LocalDateTime.now());
        Trip savedTrip = tripRepository.save(trip);

        try {
            notificationService.sendNotification(trip.getShipper().getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message", "Trip #" + trip.getTripNumber() + " has started!"),
                    "Trip Started");
            notificationService.sendNotification(trip.getTransporter().getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message", "Trip #" + trip.getTripNumber() + " has started."),
                    "Trip Started");
        } catch (Exception e) {
            log.error("Failed to send start notifications for trip {}: {}", tripId, e.getMessage());
        }

        return savedTrip;
    }

    // ── PAUSE / RESUME ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public Trip pauseTrip(Long tripId) {
        Trip trip = getTripById(tripId);
        trip.setStatus(TripStatus.PAUSED);
        return tripRepository.save(trip);
    }

    @Override
    @Transactional
    public Trip resumeTrip(Long tripId) {
        Trip trip = getTripById(tripId);
        trip.setStatus(TripStatus.IN_TRANSIT);
        return tripRepository.save(trip);
    }

    // ── UPLOAD POD ────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void uploadPOD(Long tripId, com.truckmitra.dto.request.load.PODUploadRequest request) {
        Trip trip = getTripById(tripId);
        com.truckmitra.entity.load.ProofOfDelivery pod = podRepository.findByTripId(tripId)
                .orElse(new com.truckmitra.entity.load.ProofOfDelivery());

        pod.setTrip(trip);
        pod.setImageUrl(request.getImageUrl());
        pod.setSignatureUrl(request.getSignatureUrl());
        pod.setRemarks(request.getRemarks());
        pod.setPodReferenceNumber("POD-" + trip.getTripNumber());
        podRepository.save(pod);

        trip.setPodReferenceNumber(pod.getPodReferenceNumber());
        trip.setPodUrl(pod.getImageUrl());
        trip.setPodSignatureUrl(pod.getSignatureUrl());
        trip.setStatus(TripStatus.POD_UPLOADED);
        tripRepository.save(trip);
    }

    // ── MARK DELIVERED ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public Trip markDelivered(Long tripId) {
        Trip trip = getTripById(tripId);
        if (trip.getStatus() != TripStatus.IN_TRANSIT
                && trip.getStatus() != TripStatus.PAUSED
                && trip.getStatus() != TripStatus.AT_DESTINATION) {
            throw new RuntimeException("Trip must be in transit or at destination to mark as delivered");
        }
        trip.setStatus(TripStatus.DELIVERED);
        return tripRepository.save(trip);
    }

    // ── SUBMIT DELIVERY (Both receipt + POD mandatory) ────────────────────────

    @Override
    @Transactional
    public Trip submitDelivery(Long tripId, String deliveryReceiptUrl, String podUrl) {
        Trip trip = getTripById(tripId);

        if (deliveryReceiptUrl == null || deliveryReceiptUrl.isBlank()) {
            throw new RuntimeException("Delivery receipt must be uploaded before submitting delivery");
        }
        if (podUrl == null || podUrl.isBlank()) {
            throw new RuntimeException("Proof of Delivery (POD) must be uploaded before submitting delivery");
        }

        trip.setDeliveryReceiptUrl(deliveryReceiptUrl);
        trip.setPodUrl(podUrl);
        trip.setPodReferenceNumber("POD-" + trip.getTripNumber());
        trip.setStatus(TripStatus.AWAITING_TRANSPORTER_APPROVAL);
        trip.setRejectionReason(null); // Clear any previous rejection

        // Save POD record
        com.truckmitra.entity.load.ProofOfDelivery pod = podRepository.findByTripId(tripId)
                .orElse(new com.truckmitra.entity.load.ProofOfDelivery());
        pod.setTrip(trip);
        pod.setImageUrl(podUrl);
        pod.setPodReferenceNumber("POD-" + trip.getTripNumber());
        podRepository.save(pod);

        // Log receipt verification
        com.truckmitra.entity.load.ReceiptVerification rv = com.truckmitra.entity.load.ReceiptVerification.builder()
                .trip(trip)
                .receiptUrl(deliveryReceiptUrl)
                .status(com.truckmitra.entity.common.enums.ReceiptVerificationStatus.PENDING)
                .uploadedAt(LocalDateTime.now())
                .remarks("Submitted by driver")
                .build();
        receiptVerificationRepository.save(rv);

        Trip savedTrip = tripRepository.save(trip);

        // Notify transporter
        try {
            notificationService.sendNotification(trip.getTransporter().getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message",
                            "Delivery submitted for trip #" + trip.getTripNumber() + ". Please review and approve."),
                    "Delivery Submitted - Action Required");
        } catch (Exception e) {
            log.error("Failed to notify transporter on delivery submission: {}", e.getMessage());
        }

        return savedTrip;
    }

    // ── TRANSPORTER ACCEPTS DELIVERY ──────────────────────────────────────────

    @Override
    @Transactional
    public Trip transporterAcceptDelivery(Long tripId) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() != TripStatus.AWAITING_TRANSPORTER_APPROVAL) {
            throw new RuntimeException("Trip is not awaiting transporter approval. Current: " + trip.getStatus());
        }

        Long currentUserId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        User currentUser = currentUserId == null ? null : userRepository.findById(currentUserId).orElse(null);

        // Approve receipt verification
        receiptVerificationRepository.findFirstByTripIdOrderByCreatedAtDesc(tripId)
                .ifPresent(rv -> {
                    rv.setStatus(com.truckmitra.entity.common.enums.ReceiptVerificationStatus.APPROVED);
                    rv.setVerifiedAt(LocalDateTime.now());
                    rv.setVerifiedBy(currentUser);
                    rv.setRemarks("Approved by transporter");
                    receiptVerificationRepository.save(rv);
                });

        // Update POD Audit
        podRepository.findByTripId(tripId).ifPresent(pod -> {
            pod.setApprovedBy(currentUser);
            pod.setApprovedAt(LocalDateTime.now());
            podRepository.save(pod);
        });

        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(LocalDateTime.now());

        // Free up vehicle and driver
        if (trip.getVehicle() != null) {
            trip.getVehicle().setIsAvailable(true);
            vehicleRepository.save(trip.getVehicle());
        }
        if (trip.getDriver() != null) {
            trip.getDriver().setIsOnTrip(false);
            driverRepository.save(trip.getDriver());
        }

        // Update load status
        Load load = trip.getLoad();
        load.setStatus(LoadStatus.COMPLETED);
        loadRepository.save(load);

        // Credit wallet
        try {
            walletService.creditWallet(trip.getTransporter().getId(), trip.getFreightAmount(),
                    "Trip Completion: " + trip.getTripNumber());
        } catch (Exception e) {
            log.error("Failed to credit wallet for trip {}: {}", tripId, e.getMessage());
        }

        // Generate Final Invoice PDF
        try {
            byte[] pdfBytes = pdfService.generateFinalInvoicePdf(trip);
            String pdfUrl = cloudinaryService.uploadBytes(pdfBytes, "final_invoice_" + trip.getTripNumber());
            trip.setFinalInvoicePdfUrl(pdfUrl);
            trip.setTripPdfUrl(pdfUrl); // Also update main PDF URL
            log.info("Final Invoice PDF generated for trip {}: {}", tripId, pdfUrl);
        } catch (Exception e) {
            log.error("Failed to generate Final Invoice PDF for trip {}: {}", tripId, e.getMessage(), e);
        }

        Trip savedTrip = tripRepository.save(trip);

        // Notify all parties
        try {
            notificationService.sendNotification(trip.getShipper().getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message", "Trip #" + trip.getTripNumber() + " completed successfully!"),
                    "Trip Completed");
            if (trip.getDriver() != null) {
                notificationService.sendNotification(trip.getDriver().getId(),
                        com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                        Map.of("tripId", tripId, "message",
                                "Trip #" + trip.getTripNumber() + " has been accepted and marked as Completed!"),
                        "Trip Completed");
            }
        } catch (Exception e) {
            log.error("Failed to send completion notifications: {}", e.getMessage());
        }

        return savedTrip;
    }

    // ── TRANSPORTER REJECTS DELIVERY ──────────────────────────────────────────

    @Override
    @Transactional
    public Trip transporterRejectDelivery(Long tripId, String rejectionReason) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() != TripStatus.AWAITING_TRANSPORTER_APPROVAL) {
            throw new RuntimeException("Trip is not awaiting approval. Current: " + trip.getStatus());
        }
        if (rejectionReason == null || rejectionReason.isBlank()) {
            throw new RuntimeException("Rejection reason is mandatory when rejecting delivery");
        }

        Long currentUserId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        User currentUser = currentUserId == null ? null : userRepository.findById(currentUserId).orElse(null);

        // Reject receipt verification
        receiptVerificationRepository.findFirstByTripIdOrderByCreatedAtDesc(tripId)
                .ifPresent(rv -> {
                    rv.setStatus(com.truckmitra.entity.common.enums.ReceiptVerificationStatus.REJECTED);
                    rv.setVerifiedAt(LocalDateTime.now());
                    rv.setVerifiedBy(currentUser);
                    rv.setRemarks("Rejected: " + rejectionReason);
                    receiptVerificationRepository.save(rv);
                });

        // Update POD Audit
        podRepository.findByTripId(tripId).ifPresent(pod -> {
            pod.setRejectedBy(currentUser);
            pod.setRejectedAt(LocalDateTime.now());
            podRepository.save(pod);
        });

        trip.setStatus(TripStatus.REJECTED_BY_TRANSPORTER);
        trip.setRejectionReason(rejectionReason);
        trip.setRejectedBy(currentUser);
        trip.setRejectedAt(LocalDateTime.now());

        Trip savedTrip = tripRepository.save(trip);

        // Notify driver of rejection with reason
        if (trip.getDriver() != null) {
            try {
                notificationService.sendNotification(trip.getDriver().getId(),
                        com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                        Map.of("tripId", tripId,
                                "message", "Trip Rejected By Transporter for trip #" + trip.getTripNumber()
                                        + ". Reason: " + rejectionReason + ". Please upload corrected documents."),
                        "Delivery Rejected - Action Required");
            } catch (Exception e) {
                log.error("Failed to notify driver of rejection: {}", e.getMessage());
            }
        }

        return savedTrip;
    }

    // ── DRIVER RESUBMITS DELIVERY ─────────────────────────────────────────────

    @Override
    @Transactional
    public Trip driverResubmitDelivery(Long tripId, String deliveryReceiptUrl, String podUrl) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() != TripStatus.REJECTED_BY_TRANSPORTER) {
            throw new RuntimeException("Trip is not in REJECTED_BY_TRANSPORTER status. Current: " + trip.getStatus());
        }
        if (deliveryReceiptUrl == null || deliveryReceiptUrl.isBlank()) {
            throw new RuntimeException("Delivery receipt is required for re-submission");
        }
        if (podUrl == null || podUrl.isBlank()) {
            throw new RuntimeException("POD is required for re-submission");
        }

        trip.setDeliveryReceiptUrl(deliveryReceiptUrl);
        trip.setPodUrl(podUrl);
        trip.setRejectionReason(null); // Clear rejection
        trip.setStatus(TripStatus.AWAITING_TRANSPORTER_APPROVAL);

        // Update POD record
        com.truckmitra.entity.load.ProofOfDelivery pod = podRepository.findByTripId(tripId)
                .orElse(new com.truckmitra.entity.load.ProofOfDelivery());
        pod.setTrip(trip);
        pod.setImageUrl(podUrl);
        pod.setPodReferenceNumber("POD-" + trip.getTripNumber());
        podRepository.save(pod);

        // Log new receipt verification
        com.truckmitra.entity.load.ReceiptVerification rv = com.truckmitra.entity.load.ReceiptVerification.builder()
                .trip(trip)
                .receiptUrl(deliveryReceiptUrl)
                .status(com.truckmitra.entity.common.enums.ReceiptVerificationStatus.PENDING)
                .uploadedAt(LocalDateTime.now())
                .remarks("Re-submitted by driver")
                .build();
        receiptVerificationRepository.save(rv);

        Trip savedTrip = tripRepository.save(trip);

        // Notify transporter of re-submission
        try {
            notificationService.sendNotification(trip.getTransporter().getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message",
                            "Driver re-submitted delivery for trip #" + trip.getTripNumber() + ". Please review."),
                    "Delivery Re-Submitted");
        } catch (Exception e) {
            log.error("Failed to notify transporter on re-submission: {}", e.getMessage());
        }

        return savedTrip;
    }

    // ── TRIP PHOTOS ───────────────────────────────────────────────────────────

    @Override
    @Transactional
    public com.truckmitra.entity.load.TripPhoto uploadTripPhoto(Long tripId, String photoUrl, com.truckmitra.entity.common.enums.PhotoType type) {
        Trip trip = getTripById(tripId);
        Long currentUserId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        User currentUser = currentUserId == null ? null : userRepository.findById(currentUserId).orElse(null);

        com.truckmitra.entity.load.TripPhoto photo = com.truckmitra.entity.load.TripPhoto.builder()
                .trip(trip)
                .driver(currentUser) // assuming uploaded by driver
                .type(type)
                .photoUrl(photoUrl)
                .uploadedAt(LocalDateTime.now())
                .uploadedBy(currentUser)
                .approvalStatus("PENDING")
                .build();

        return tripPhotoRepository.save(photo);
    }

    @Override
    public List<com.truckmitra.entity.load.TripPhoto> getTripPhotos(Long tripId) {
        return tripPhotoRepository.findByTripId(tripId);
    }

    // ── END TRIP (legacy endpoint) ────────────────────────────────────────────

    @Override
    @Transactional
    public Trip endTrip(Long tripId, String podUrl) {
        Trip trip = getTripById(tripId);
        trip.setStatus(TripStatus.DELIVERED);
        trip.setPodUrl(podUrl);

        com.truckmitra.entity.load.ReceiptVerification rv = com.truckmitra.entity.load.ReceiptVerification.builder()
                .trip(trip)
                .receiptUrl(podUrl)
                .status(com.truckmitra.entity.common.enums.ReceiptVerificationStatus.PENDING)
                .uploadedAt(LocalDateTime.now())
                .remarks("Uploaded by driver")
                .build();
        receiptVerificationRepository.save(rv);

        try {
            notificationService.sendNotification(trip.getTransporter().getId(),
                    com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                    Map.of("tripId", tripId, "message",
                            "Receipt uploaded for trip #" + trip.getTripNumber() + ". Please verify."),
                    "Receipt Uploaded");
        } catch (Exception e) {
            log.error("Failed to notify transporter: {}", e.getMessage());
        }

        return tripRepository.save(trip);
    }

    // ── GENERIC STATUS UPDATE ─────────────────────────────────────────────────

    @Override
    @Transactional
    public Trip updateTripStatus(Long tripId, String status) {
        Trip trip = getTripById(tripId);
        TripStatus newStatus = TripStatus.valueOf(status);
        trip.setStatus(newStatus);

        if (newStatus == TripStatus.ACCEPTED) {
            try {
                lrService.generateLR(tripId);
            } catch (Exception e) {
                log.error("Failed to generate LR on accept: {}", e.getMessage());
            }
        }

        Long currentUserId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        User currentUser = currentUserId == null ? null : userRepository.findById(currentUserId).orElse(null);

        if (newStatus == TripStatus.COMPLETED) {
            receiptVerificationRepository.findFirstByTripIdOrderByCreatedAtDesc(tripId)
                    .ifPresent(rv -> {
                        rv.setStatus(com.truckmitra.entity.common.enums.ReceiptVerificationStatus.APPROVED);
                        rv.setVerifiedAt(LocalDateTime.now());
                        rv.setVerifiedBy(currentUser);
                        rv.setRemarks("Approved by transporter");
                        receiptVerificationRepository.save(rv);
                    });

            trip.setCompletedAt(LocalDateTime.now());
            if (trip.getVehicle() != null) {
                trip.getVehicle().setIsAvailable(true);
                vehicleRepository.save(trip.getVehicle());
            }
            if (trip.getDriver() != null) {
                trip.getDriver().setIsOnTrip(false);
                driverRepository.save(trip.getDriver());
            }

            Load load = trip.getLoad();
            load.setStatus(LoadStatus.COMPLETED);
            loadRepository.save(load);

            try {
                walletService.creditWallet(trip.getTransporter().getId(), trip.getFreightAmount(),
                        "Trip Completion: " + trip.getTripNumber());
            } catch (Exception e) {
                log.error("Failed to credit wallet for trip {}: {}", tripId, e.getMessage());
            }

            try {
                byte[] pdfBytes = pdfService.generateTripPdf(trip);
                String pdfUrl = cloudinaryService.uploadBytes(pdfBytes, "invoice_trip_" + trip.getTripNumber());
                trip.setTripPdfUrl(pdfUrl);
            } catch (Exception e) {
                log.error("Failed to generate invoice PDF: {}", e.getMessage(), e);
            }

            try {
                notificationService.sendNotification(trip.getShipper().getId(),
                        com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                        Map.of("tripId", tripId, "message", "Trip #" + trip.getTripNumber() + " completed."),
                        "Trip Completed");
            } catch (Exception e) {
                log.error("Notification error: {}", e.getMessage());
            }
        } else if (newStatus == TripStatus.REJECTED) {
            receiptVerificationRepository.findFirstByTripIdOrderByCreatedAtDesc(tripId)
                    .ifPresent(rv -> {
                        rv.setStatus(com.truckmitra.entity.common.enums.ReceiptVerificationStatus.REJECTED);
                        rv.setVerifiedAt(LocalDateTime.now());
                        rv.setVerifiedBy(currentUser);
                        rv.setRemarks("Rejected by transporter. Please re-upload.");
                        receiptVerificationRepository.save(rv);
                    });

            if (trip.getDriver() != null) {
                try {
                    notificationService.sendNotification(trip.getDriver().getId(),
                            com.truckmitra.enums.NotificationTemplate.NOTIFICATION,
                            Map.of("tripId", tripId, "message",
                                    "Receipt for trip #" + trip.getTripNumber() + " was rejected. Please re-upload."),
                            "Receipt Rejected");
                } catch (Exception e) {
                    log.error("Failed to notify driver of rejection: {}", e.getMessage());
                }
            }
        }

        return tripRepository.save(trip);
    }

    // ── LOCATION UPDATE ───────────────────────────────────────────────────────

    @Override
    @Transactional
    public void updateLocation(Long tripId, Double lat, Double lng, Double speed) {
        Trip trip = getTripById(tripId);
        trip.setCurrentLat(lat);
        trip.setCurrentLng(lng);

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
    public Trip getTripByLoadId(Long loadId) {
        return tripRepository.findByLoadId(loadId)
                .orElseThrow(() -> new RuntimeException("Trip not found for load: " + loadId));
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
