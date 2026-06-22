// src/main/java/com/truckmitra/service/TripService.java
package com.truckmitra.service;

import com.truckmitra.entity.load.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;

public interface TripService {
    Trip getTripById(Long id);
    Trip getTripByLoadId(Long loadId);
    Trip createInitialTrip(Long loadId, Long bidId);
    Trip assignDirectTransporterLoad(Long loadId, Long driverId, Long vehicleId, java.math.BigDecimal driverAmount);
    Trip assignVehicle(Long tripId, Long vehicleId);
    Trip assignDriver(Long tripId, Long driverId, java.math.BigDecimal driverAmount);
    Trip assignFleet(Long tripId, Long driverId, Long vehicleId, java.math.BigDecimal driverAmount);
    Trip startTrip(Long tripId);
    Trip pauseTrip(Long tripId);
    Trip resumeTrip(Long tripId);
    Trip endTrip(Long tripId, String podUrl);
    Trip acceptTripAssignment(Long tripId);
    Trip rejectTripAssignment(Long tripId);
    void uploadPOD(Long tripId, com.truckmitra.dto.request.load.PODUploadRequest request);
    Trip markDelivered(Long tripId);

    Trip updateTripStatus(Long tripId, String status);
    List<Trip> getDriverTrips(Long driverId);
    List<Trip> getTransporterTrips(Long transporterId);
    List<Trip> getShipperTrips(Long shipperId);
    void updateLocation(Long tripId, Double lat, Double lng, Double speed);
    void updateLocationFull(Long tripId, Double lat, Double lng, Double speed, Double heading, Double accuracy);
    List<com.truckmitra.entity.load.TripLocation> getTrackingHistory(Long tripId);

    List<Trip> getActiveTripsForAdmin();
    List<Trip> getActiveTripsForShipper(Long shipperId);
    Trip updateTripStartPhoto(Long tripId, String photoUrl);

    /** Upload pickup receipt URL to the trip */
    Trip setPickupReceiptUrl(Long tripId, String pickupReceiptUrl);

    // ── New Workflow Methods ─────────────────────────────────────────────────

    /** Driver signals location is enabled (before start) */
    Trip setLocationEnabled(Long tripId);

    /** Driver starts trip — validates: pickupReceiptUrl uploaded + location enabled */
    Trip startTripWithValidation(Long tripId);

    /** Driver submits delivery: requires deliveryReceiptUrl + podUrl → AWAITING_TRANSPORTER_APPROVAL */
    Trip submitDelivery(Long tripId, String deliveryReceiptUrl, String podUrl);

    /** Transporter accepts delivery → COMPLETED + generates final invoice PDF */
    Trip transporterAcceptDelivery(Long tripId);

    /** Transporter rejects delivery → REJECTED_BY_TRANSPORTER + stores reason + notifies driver */
    Trip transporterRejectDelivery(Long tripId, String rejectionReason);

    /** Driver re-submits corrected delivery docs → AWAITING_TRANSPORTER_APPROVAL */
    Trip driverResubmitDelivery(Long tripId, String deliveryReceiptUrl, String podUrl);

    com.truckmitra.entity.load.TripPhoto uploadTripPhoto(Long tripId, String photoUrl, com.truckmitra.entity.common.enums.PhotoType type);
    
    List<com.truckmitra.entity.load.TripPhoto> getTripPhotos(Long tripId);

    Page<Trip> getCompletedTrips(Long userId, String role, String search, String dateFilter, LocalDate startDate, LocalDate endDate, Pageable pageable);
}
