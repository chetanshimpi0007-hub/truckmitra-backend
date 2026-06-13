// src/main/java/com/truckmitra/entity/user/Transporter.java
package com.truckmitra.entity.user;

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

    @Column(nullable = false)
    private String agencyName;

    private String gstNumber;

    private String panNumber;

    private String aadhaarNumber;

    private String aadhaarFrontImageUrl;

    private String aadhaarBackImageUrl;

    private String panCardImageUrl;

    private String officeAddress;

    @Column(nullable = false)
    private Integer fleetSize;

    private String serviceAreas;

    private Integer experienceInYears;

    private String gstCertificateUrl;

    private String businessCardUrl;

    // Stats
    @Builder.Default
    private Integer totalDrivers = 0;

    @Builder.Default
    private Integer totalVehicles = 0;

    @Builder.Default
    private Integer bidsWon = 0;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer totalRatings = 0;

    @Builder.Default
    private Double averageDriverRating = 0.0;

    @Builder.Default
    private Integer totalDriverRatings = 0;

    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private Double commissionRate = 5.0;

    @Builder.Default
    private Double totalEarnings = 0.0;

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
    private LocalDateTime subscriptionStartDate;

    private LocalDateTime subscriptionEndDate;

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