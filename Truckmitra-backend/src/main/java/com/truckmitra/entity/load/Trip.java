// src/main/java/com/truckmitra/entity/load/Trip.java
package com.truckmitra.entity.load;

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

    @Column(unique = true, nullable = false)
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

    private LocalDateTime pickupDate;
    private LocalDateTime deliveryDate;

    // Analytics & Costs
    private Double carbonEmission;
    private Double totalTollCost;
    private Double fuelCost;
    private Double driverCharges;

    // Route Intelligence (OSRM)
    private Integer estimatedTravelTimeMins;
    private Integer tollPlazaCount;
    private Double estimatedTollCost;
    private Double fuelEstimateLiters;
    private Double sourceLatitude;
    private Double sourceLongitude;
    private Double destinationLatitude;
    private Double destinationLongitude;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    private String startPhotoUrl;
    private String podUrl; // Proof of delivery image
    private String podSignatureUrl;
    private String podReferenceNumber;
    private String tripPdfUrl;

    // Workflow document URLs
    private String assignmentPdfUrl;      // Generated on ACCEPTED
    private String finalInvoicePdfUrl;    // Generated on COMPLETED
    private String pickupReceiptUrl;      // Required before START TRIP
    private String deliveryReceiptUrl;    // Required for delivery submission
    private String rejectionReason;       // Filled by transporter when rejecting

    // Location enablement flag (set by driver before starting trip)
    @Builder.Default
    private Boolean locationEnabled = false;

    // Live location
    private Double currentLat;
    private Double currentLng;
    private LocalDateTime lastLocationUpdate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rejected_by")
    private com.truckmitra.entity.user.User rejectedBy;

    private LocalDateTime rejectedAt;
}
