// src/main/java/com/truckmitra/entity/load/Trip.java
package com.truckmitra.entity.load;

import jakarta.persistence.Column;
import com.truckmitra.entity.common.BaseEntity;
import com.truckmitra.entity.common.enums.TripStatus;
import com.truckmitra.entity.fleet.Vehicle;
import com.truckmitra.entity.user.Driver;
import com.truckmitra.entity.user.Shipper;
import com.truckmitra.entity.user.Transporter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trips")
@SQLDelete(sql = "UPDATE trips SET is_deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "is_deleted = false")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Trip extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_number", unique = true, nullable = false)
    private String tripNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_id", nullable = false)
    private Load load;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bid_id")
    private Bid bid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_id")
    private Shipper shipper;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id", nullable = false)
    private Transporter transporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Enumerated(EnumType.STRING)
    private TripStatus status;

    private String source;
    private String destination;
    private Double distance;
    private java.math.BigDecimal freightAmount;
    private java.math.BigDecimal shipperAmount;
    private java.math.BigDecimal driverAmount;

    @Column(name = "pickup_date")
    private LocalDateTime pickupDate;
    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    // Analytics & Costs
    @Column(name = "carbon_emission")
    private Double carbonEmission;
    @Column(name = "total_toll_cost")
    private Double totalTollCost;
    @Column(name = "fuel_cost")
    private Double fuelCost;
    @Column(name = "driver_charges")
    private Double driverCharges;

    // Route Intelligence (OSRM)
    @Column(name = "estimated_travel_time_mins")
    private Integer estimatedTravelTimeMins;
    @Column(name = "toll_plaza_count")
    private Integer tollPlazaCount;
    @Column(name = "estimated_toll_cost")
    private Double estimatedTollCost;
    @Column(name = "fuel_estimate_liters")
    private Double fuelEstimateLiters;
    @Column(name = "source_latitude")
    private Double sourceLatitude;
    @Column(name = "source_longitude")
    private Double sourceLongitude;
    @Column(name = "destination_latitude")
    private Double destinationLatitude;
    @Column(name = "destination_longitude")
    private Double destinationLongitude;

    @Column(name = "started_at")
    private LocalDateTime startedAt;
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "start_photo_url")
    private String startPhotoUrl;
    @Column(name = "pod_url")
    private String podUrl; // Proof of delivery image
    @Column(name = "pod_signature_url")
    private String podSignatureUrl;
    @Column(name = "pod_reference_number")
    private String podReferenceNumber;
    @Column(name = "trip_pdf_url")
    private String tripPdfUrl;

    // Workflow document URLs
    @Column(name = "assignment_pdf_url")
    private String assignmentPdfUrl;      // Generated on ACCEPTED
    private String finalInvoicePdfUrl;    // Generated on COMPLETED
    @Column(name = "pickup_receipt_url")
    private String pickupReceiptUrl;      // Required before START TRIP
    @Column(name = "delivery_receipt_url")
    private String deliveryReceiptUrl;    // Required for delivery submission
    @Column(name = "rejection_reason")
    private String rejectionReason;       // Filled by transporter when rejecting

    // Location enablement flag (set by driver before starting trip)
    @Column(name = "location_enabled")
    @Builder.Default
    private Boolean locationEnabled = false;

    // Live location
    @Column(name = "current_lat")
    private Double currentLat;
    @Column(name = "current_lng")
    private Double currentLng;
    @Column(name = "last_location_update")
    private LocalDateTime lastLocationUpdate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rejected_by")
    private com.truckmitra.entity.user.User rejectedBy;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;
}
