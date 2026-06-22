// src/main/java/com/truckmitra/entity/user/Transporter.java
package com.truckmitra.entity.user;

import jakarta.persistence.Column;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transporters")  // ← Separate table for transporters
@PrimaryKeyJoinColumn(name = "user_id")
public class Transporter extends User {

    @Column(name = "agency_name", nullable = false)
    private String agencyName;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "aadhaar_number")
    private String aadhaarNumber;

    @Column(name = "aadhaar_front_image_url")
    private String aadhaarFrontImageUrl;

    @Column(name = "aadhaar_back_image_url")
    private String aadhaarBackImageUrl;

    @Column(name = "pan_card_image_url")
    private String panCardImageUrl;

    @Column(name = "office_address")
    private String officeAddress;

    @Column(name = "fleet_size", nullable = false)
    private Integer fleetSize;

    @Column(name = "service_areas")
    private String serviceAreas;

    @Column(name = "experience_in_years")
    private Integer experienceInYears;

    @Column(name = "gst_certificate_url")
    private String gstCertificateUrl;

    @Column(name = "business_card_url")
    private String businessCardUrl;

    // Stats
    @Column(name = "total_drivers")
    @Builder.Default
    private Integer totalDrivers = 0;

    @Column(name = "total_vehicles")
    @Builder.Default
    private Integer totalVehicles = 0;

    @Column(name = "bids_won")
    @Builder.Default
    private Integer bidsWon = 0;

    @Column(name = "average_rating")
    @Builder.Default
    private Double averageRating = 0.0;

    @Column(name = "total_ratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "average_driver_rating")
    @Builder.Default
    private Double averageDriverRating = 0.0;

    @Column(name = "total_driver_ratings")
    @Builder.Default
    private Integer totalDriverRatings = 0;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "commission_rate")
    @Builder.Default
    private Double commissionRate = 5.0;

    @Column(name = "total_earnings")
    @Builder.Default
    private Double totalEarnings = 0.0;

    @Column(name = "free_bids_remaining")
    @Builder.Default
    private Integer freeBidsRemaining = 2;

    // Fleet management
    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "transporter_drivers", 
                     joinColumns = @JoinColumn(name = "transporter_id"))
    @Column(name = "driver_id")
    private List<Long> driverIds = new ArrayList<>();

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "transporter_vehicles", 
                     joinColumns = @JoinColumn(name = "transporter_id"))
    @Column(name = "vehicle_id")
    private List<Long> vehicleIds = new ArrayList<>();

    // Subscription
    @Column(name = "subscription_start_date")
    private LocalDateTime subscriptionStartDate;

    @Column(name = "subscription_end_date")
    private LocalDateTime subscriptionEndDate;

    @Column(name = "subscription_plan")
    private String subscriptionPlan;

    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "transporter", fetch = FetchType.LAZY)
    @Builder.Default
    private List<com.truckmitra.entity.load.Load> loads = new ArrayList<>();

    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "transporter", fetch = FetchType.LAZY)
    @Builder.Default
    private List<com.truckmitra.entity.load.Bid> bids = new ArrayList<>();

    public void addDriver(Long driverId) {
        if (this.driverIds == null) {
            this.driverIds = new ArrayList<>();
        }
        this.driverIds.add(driverId);
        this.totalDrivers = this.driverIds.size();
    }

    public void addVehicle(Long vehicleId) {
        if (this.vehicleIds == null) {
            this.vehicleIds = new ArrayList<>();
        }
        this.vehicleIds.add(vehicleId);
        this.totalVehicles = this.vehicleIds.size();
    }

    public boolean hasFreeBids() {
        return this.freeBidsRemaining > 0;
    }

    public void useFreeBid() {
        if (hasFreeBids()) {
            this.freeBidsRemaining--;
        }
    }

    public void winBid(Double amount) {
        this.bidsWon++;
        this.totalEarnings += amount;
    }

    public void updateRating(Integer newRating) {
        Double total = this.averageRating * this.totalRatings + newRating;
        this.totalRatings++;
        this.averageRating = total / this.totalRatings;
    }

    public void updateDriverRating(Integer newRating) {
        Double total = this.averageDriverRating * this.totalDriverRatings + newRating;
        this.totalDriverRatings++;
        this.averageDriverRating = total / this.totalDriverRatings;
    }
}