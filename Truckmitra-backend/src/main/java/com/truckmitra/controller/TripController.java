// src/main/java/com/truckmitra/controller/TripController.java
package com.truckmitra.controller;

import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.service.PdfService;
import com.truckmitra.service.TripService;
import com.truckmitra.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final PdfService pdfService;
    private final DriverRepository driverRepository;
    private final CloudinaryService cloudinaryService;

    // ── PDF DOWNLOADS ─────────────────────────────────────────────────────────

    /** Download trip details PDF (legacy) */
    @GetMapping("/{tripId}/pdf")
    public ResponseEntity<byte[]> getTripPdf(@PathVariable Long tripId) throws java.io.IOException {
        Trip trip = tripService.getTripById(tripId);
        byte[] pdf = pdfService.generateTripPdf(trip);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=invoice_trip_" + tripId + ".pdf")
                .body(pdf);
    }

    /** Download Assignment PDF (generated when driver accepts) */
    @GetMapping("/{tripId}/assignment-pdf")
    @PreAuthorize("hasRole('DRIVER') or hasRole('TRANSPORTER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> getAssignmentPdf(@PathVariable Long tripId) throws java.io.IOException {
        Trip trip = tripService.getTripById(tripId);
        // If Cloudinary URL exists, redirect; else generate fresh
        if (trip.getAssignmentPdfUrl() != null) {
            return ResponseEntity.status(302)
                    .header("Location", trip.getAssignmentPdfUrl())
                    .build();
        }
        byte[] pdf = pdfService.generateAssignmentPdf(trip, null);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=assignment_" + tripId + ".pdf")
                .body(pdf);
    }

    /** Download Final Invoice PDF (generated when trip completes) */
    @GetMapping("/{tripId}/final-invoice")
    @PreAuthorize("hasRole('DRIVER') or hasRole('TRANSPORTER') or hasRole('SHIPPER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> getFinalInvoice(@PathVariable Long tripId) throws java.io.IOException {
        Trip trip = tripService.getTripById(tripId);
        if (trip.getFinalInvoicePdfUrl() != null) {
            return ResponseEntity.status(302)
                    .header("Location", trip.getFinalInvoicePdfUrl())
                    .build();
        }
        byte[] pdf = pdfService.generateFinalInvoicePdf(trip);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=final_invoice_" + tripId + ".pdf")
                .body(pdf);
    }

    /** Get trip details by ID */
    @GetMapping("/{tripId}")
    @PreAuthorize("hasRole('DRIVER') or hasRole('TRANSPORTER') or hasRole('SHIPPER') or hasRole('ADMIN')")
    public ResponseEntity<Trip> getTripById(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.getTripById(tripId));
    }

    /** Get trip details by Load ID */
    @GetMapping("/load/{loadId}")
    @PreAuthorize("hasRole('DRIVER') or hasRole('TRANSPORTER') or hasRole('SHIPPER') or hasRole('ADMIN')")
    public ResponseEntity<Trip> getTripByLoadId(@PathVariable Long loadId) {
        return ResponseEntity.ok(tripService.getTripByLoadId(loadId));
    }

    // ── TRIP ASSIGNMENT ───────────────────────────────────────────────────────

    /** Transporter assigns both driver and vehicle to a trip */
    @PostMapping("/assign-fleet")
    @PreAuthorize("hasRole('TRANSPORTER') or hasRole('ADMIN')")
    public ResponseEntity<Trip> assignFleet(
            @RequestParam Long tripId,
            @RequestParam Long driverId,
            @RequestParam Long vehicleId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            org.slf4j.LoggerFactory.getLogger(TripController.class)
                    .info("assignFleet called by user: {} with authorities: {}",
                            userDetails.getUsername(), userDetails.getAuthorities());
        }
        return ResponseEntity.ok(tripService.assignFleet(tripId, driverId, vehicleId));
    }

    /** Transporter assigns driver and vehicle directly to a load they created */
    @PostMapping("/direct-assign")
    @PreAuthorize("hasRole('TRANSPORTER') or hasRole('ADMIN')")
    public ResponseEntity<Trip> directAssign(
            @RequestParam Long loadId,
            @RequestParam Long driverId,
            @RequestParam(required = false) Long vehicleId) {
        return ResponseEntity.ok(tripService.assignDirectTransporterLoad(loadId, driverId, vehicleId));
    }

    /** Transporter assigns a driver to a trip */
    @PostMapping("/{tripId}/assign-driver/{driverId}")
    @PreAuthorize("hasRole('TRANSPORTER') or hasRole('ADMIN')")
    public ResponseEntity<Trip> assignDriver(@PathVariable Long tripId, @PathVariable Long driverId) {
        return ResponseEntity.ok(tripService.assignDriver(tripId, driverId));
    }

    // ── DRIVER ACCEPT / REJECT ────────────────────────────────────────────────

    /** Driver accepts trip assignment → generates Assignment PDF */
    @PostMapping("/{tripId}/accept-assignment")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> acceptAssignment(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.acceptTripAssignment(tripId));
    }

    /** Driver rejects trip assignment */
    @PostMapping("/{tripId}/reject-assignment")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> rejectAssignment(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.rejectTripAssignment(tripId));
    }

    // ── DRIVER WORKFLOW ───────────────────────────────────────────────────────

    /** Driver signals GPS location is enabled */
    @PostMapping("/{tripId}/location-enabled")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> setLocationEnabled(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.setLocationEnabled(tripId));
    }

    /** Driver uploads pickup receipt URL (before START TRIP) */
    @PostMapping("/{tripId}/upload-pickup-receipt")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> uploadPickupReceipt(
            @PathVariable Long tripId,
            @RequestParam String receiptUrl) {
        return ResponseEntity.ok(tripService.setPickupReceiptUrl(tripId, receiptUrl));
    }

    /** Driver uploads pickup receipt file and stores URL */
    @PostMapping("/{tripId}/pickup-receipt")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Map<String, Object>> uploadPickupReceiptFile(
            @PathVariable Long tripId,
            @RequestParam("file") MultipartFile file) throws java.io.IOException {
        String url = cloudinaryService.uploadFile(file);
        return ResponseEntity.ok(Map.of("url", url, "message", "Pickup receipt uploaded successfully. Use this URL with /upload-pickup-receipt endpoint."));
    }

    /** Driver starts trip — validates: pickup receipt uploaded + location enabled.
     *  Returns 400 with exact validation message if preconditions not met. */
    @PostMapping("/{tripId}/start")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> startTrip(@PathVariable Long tripId) {
        try {
            return ResponseEntity.ok(tripService.startTripWithValidation(tripId));
        } catch (RuntimeException ex) {
            org.slf4j.LoggerFactory.getLogger(TripController.class)
                    .error("Start trip failed for {}: {}", tripId, ex.getMessage(), ex);
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", ex.getMessage(), "status", 400));
        }
    }

    /** Driver ends trip (legacy endpoint) */
    @PostMapping("/{tripId}/end")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> endTrip(@PathVariable Long tripId, @RequestParam String receiptUrl) {
        return ResponseEntity.ok(tripService.endTrip(tripId, receiptUrl));
    }

    /** Generic status update.
     *  NOTE: STARTED is BLOCKED here — drivers must use POST /start which validates pickup receipt + GPS. */
    @PatchMapping("/{tripId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRANSPORTER') or hasRole('DRIVER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long tripId, @RequestParam String status) {
        if ("STARTED".equals(status)) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of(
                            "message", "Use POST /api/trips/" + tripId + "/start to start a trip. Pickup receipt and GPS location validation required.",
                            "status", 400));
        }
        try {
            return ResponseEntity.ok(tripService.updateTripStatus(tripId, status));
        } catch (RuntimeException ex) {
            org.slf4j.LoggerFactory.getLogger(TripController.class)
                    .error("Status update failed for trip {} to {}: {}", tripId, status, ex.getMessage(), ex);
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", ex.getMessage(), "status", 400));
        }
    }

    /** Driver uploads source photo (confirms arrival at pickup) */
    @PostMapping("/{tripId}/upload-source-photo")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> uploadSourcePhoto(
            @PathVariable Long tripId,
            @RequestParam String photoUrl) {
        return ResponseEntity.ok(tripService.updateTripStartPhoto(tripId, photoUrl));
    }

    /** Driver uploads delivery receipt details */
    @PostMapping("/{tripId}/pod")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Void> uploadPOD(
            @PathVariable Long tripId,
            @RequestBody com.truckmitra.dto.request.load.PODUploadRequest request) {
        tripService.uploadPOD(tripId, request);
        return ResponseEntity.ok().build();
    }

    /** Driver marks trip as delivered */
    @PostMapping("/{tripId}/deliver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> markDelivered(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.markDelivered(tripId));
    }

    /** Driver pauses trip */
    @PostMapping("/{tripId}/pause")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> pauseTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.pauseTrip(tripId));
    }

    /** Driver resumes trip */
    @PostMapping("/{tripId}/resume")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> resumeTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.resumeTrip(tripId));
    }

    // ── DELIVERY SUBMISSION ───────────────────────────────────────────────────

    /** Driver submits delivery — both deliveryReceiptUrl AND podUrl required */
    @PostMapping("/{tripId}/submit-delivery")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> submitDelivery(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> body) {
        String deliveryReceiptUrl = body.get("deliveryReceiptUrl");
        String podUrl = body.get("podUrl");
        return ResponseEntity.ok(tripService.submitDelivery(tripId, deliveryReceiptUrl, podUrl));
    }

    /** Driver re-submits corrected delivery documents after rejection */
    @PostMapping("/{tripId}/driver-resubmit")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> driverResubmit(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> body) {
        String deliveryReceiptUrl = body.get("deliveryReceiptUrl");
        String podUrl = body.get("podUrl");
        return ResponseEntity.ok(tripService.driverResubmitDelivery(tripId, deliveryReceiptUrl, podUrl));
    }

    // ── TRANSPORTER APPROVAL ──────────────────────────────────────────────────

    /** Transporter accepts delivery → COMPLETED + generates Final Invoice PDF */
    @PostMapping("/{tripId}/transporter-accept")
    @PreAuthorize("hasRole('TRANSPORTER') or hasRole('ADMIN')")
    public ResponseEntity<Trip> transporterAccept(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.transporterAcceptDelivery(tripId));
    }

    /** Transporter rejects delivery — rejectionReason mandatory */
    @PostMapping("/{tripId}/transporter-reject")
    @PreAuthorize("hasRole('TRANSPORTER') or hasRole('ADMIN')")
    public ResponseEntity<Trip> transporterReject(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> body) {
        String reason = body.get("rejectionReason");
        return ResponseEntity.ok(tripService.transporterRejectDelivery(tripId, reason));
    }

    /** Transporter verifies receipt (legacy) */
    @PatchMapping("/{tripId}/verify-receipt")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<Trip> verifyReceipt(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.transporterAcceptDelivery(tripId));
    }

    /** Transporter rejects receipt (legacy) */
    @PatchMapping("/{tripId}/reject-receipt")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<Trip> rejectReceipt(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.updateTripStatus(tripId, "REJECTED_BY_TRANSPORTER"));
    }

    // ── TRIP QUERIES ──────────────────────────────────────────────────────────

    /** Get all trips for a specific driver */
    @GetMapping("/driver/{driverId}")
    @PreAuthorize("hasRole('DRIVER') or hasRole('ADMIN')")
    public ResponseEntity<List<Trip>> getDriverTrips(@PathVariable Long driverId) {
        return ResponseEntity.ok(tripService.getDriverTrips(driverId));
    }

    /** Get all trips for a specific transporter */
    @GetMapping("/transporter/{transporterId}")
    @PreAuthorize("hasRole('TRANSPORTER') or hasRole('ADMIN')")
    public ResponseEntity<List<Trip>> getTransporterTrips(@PathVariable Long transporterId) {
        return ResponseEntity.ok(tripService.getTransporterTrips(transporterId));
    }

    /** Upload a trip photo (Pickup or Destination) */
    @PostMapping("/{tripId}/photos")
    @PreAuthorize("hasRole('DRIVER') or hasRole('TRANSPORTER') or hasRole('ADMIN')")
    public ResponseEntity<com.truckmitra.entity.load.TripPhoto> uploadTripPhoto(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> request) {
        String photoUrl = request.get("photoUrl");
        String typeStr = request.get("type");
        if (photoUrl == null || typeStr == null) {
            return ResponseEntity.badRequest().build();
        }
        com.truckmitra.entity.common.enums.PhotoType type = com.truckmitra.entity.common.enums.PhotoType.valueOf(typeStr.toUpperCase());
        return ResponseEntity.ok(tripService.uploadTripPhoto(tripId, photoUrl, type));
    }

    /** Get all photos for a trip */
    @GetMapping("/{tripId}/photos")
    @PreAuthorize("hasRole('DRIVER') or hasRole('TRANSPORTER') or hasRole('ADMIN')")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<com.truckmitra.dto.response.TripPhotoResponse>> getTripPhotos(@PathVariable Long tripId) {
        List<com.truckmitra.entity.load.TripPhoto> photos = tripService.getTripPhotos(tripId);
        List<com.truckmitra.dto.response.TripPhotoResponse> response = photos.stream()
            .map(p -> com.truckmitra.dto.response.TripPhotoResponse.builder()
                .id(p.getId())
                .photoType(p.getType().name())
                .photoUrl(p.getPhotoUrl())
                .uploadedAt(p.getUploadedAt())
                .uploadedBy(p.getUploadedBy() != null ? p.getUploadedBy().getFullName() : "Unknown Driver")
                .build())
            .toList();
        return ResponseEntity.ok(response);
    }
}
