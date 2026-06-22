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

    @Column(name = "tripnumber", unique = true, nullable = false)
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

    @Column(name = "pickupdate")
    private LocalDateTime pickupDate;
    @Column(name = "deliverydate")
    private LocalDateTime deliveryDate;

    // Analytics & Costs
    @Column(name = "carbonemission")
    private Double carbonEmission;
    @Column(name = "totaltollcost")
    private Double totalTollCost;
    @Column(name = "fuelcost")
    private Double fuelCost;
    @Column(name = "drivercharges")
    private Double driverCharges;

    // Route Intelligence (OSRM)
    @Column(name = "estimatedtraveltimemins")
    private Integer estimatedTravelTimeMins;
    @Column(name = "tollplazacount")
    private Integer tollPlazaCount;
    @Column(name = "estimatedtollcost")
    private Double estimatedTollCost;
    @Column(name = "fuelestimateliters")
    private Double fuelEstimateLiters;
    @Column(name = "sourcelatitude")
    private Double sourceLatitude;
    @Column(name = "sourcelongitude")
    private Double sourceLongitude;
    @Column(name = "destinationlatitude")
    private Double destinationLatitude;
    @Column(name = "destinationlongitude")
    private Double destinationLongitude;

    @Column(name = "startedat")
    private LocalDateTime startedAt;
    @Column(name = "completedat")
    private LocalDateTime completedAt;

    @Column(name = "startphotourl")
    private String startPhotoUrl;
    @Column(name = "podurl")
    private String podUrl; // Proof of delivery image
    @Column(name = "podsignatureurl")
    private String podSignatureUrl;
    @Column(name = "podreferencenumber")
    private String podReferenceNumber;
    @Column(name = "trip_pdf_url")
    private String tripPdfUrl;

    // Workflow document URLs
    @Column(name = "assignmentpdfurl")
    private String assignmentPdfUrl;      // Generated on ACCEPTED
    private String finalInvoicePdfUrl;    // Generated on COMPLETED
    @Column(name = "pickupreceipturl")
    private String pickupReceiptUrl;      // Required before START TRIP
    @Column(name = "deliveryreceipturl")
    private String deliveryReceiptUrl;    // Required for delivery submission
    @Column(name = "rejectionreason")
    private String rejectionReason;       // Filled by transporter when rejecting

    // Location enablement flag (set by driver before starting trip)
    @Column(name = "locationenabled")
    @Builder.Default
    private Boolean locationEnabled = false;

    // Live location
    @Column(name = "currentlat")
    private Double currentLat;
    @Column(name = "currentlng")
    private Double currentLng;
    @Column(name = "lastlocationupdate")
    private LocalDateTime lastLocationUpdate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rejected_by")
    private com.truckmitra.entity.user.User rejectedBy;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;
}
