// src/main/java/com/truckmitra/entity/user/Driver.java
package com.truckmitra.entity.user;

import com.truckmitra.entity.common.enums.VehicleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import com.truckmitra.entity.load.Trip;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "drivers")  // ← Separate table for drivers
@PrimaryKeyJoinColumn(name = "user_id")  // ← Links to users table
public class Driver extends User {

    @Column(name = "driving_license_number")
    private String drivingLicenseNumber;

    private String drivingLicenseImageUrl;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Enumerated(EnumType.STRING)
    private VehicleType preferredVehicleType;

    private String aadhaarFrontImageUrl;
    private String aadhaarBackImageUrl;
    private String panCardImageUrl;
    private String aadhaarNumber;
    private String panNumber;

    private String vehicleNumber;
    private String vehicleCapacity;
    private String vehiclePucImageUrl;
    private String vehicleFrontImageUrl;
    private String vehicleBackImageUrl;
    private String vehicleInsuranceImageUrl;
    private String vehicleFuelType;

    private Double currentLatitude;

    private Double currentLongitude;

    private LocalDateTime lastLocationUpdate;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isAvailable = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isOnTrip = false;

    @Builder.Default
    private Integer totalTripsCompleted = 0;

    @Builder.Default
    private Double totalEarnings = 0.0;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "transporter_id")
    private Long transporterId;

    // Bank details
    private String accountHolderName;

    private String bankName;

    private String accountNumber;

    private String ifscCode;

    private String upiId;

    // Emergency contact
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_number", length = 10)
    private String emergencyContactNumber;

    // Preferences
    @Builder.Default
    private Boolean availableForLongRoute = true;

    @Builder.Default
    private Boolean availableForLocalRoute = true;

    @Builder.Default
    private Double minimumAdvanceRequired = 0.0;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Trip> trips = new ArrayList<>();

    public void updateRating(Integer newRating) {
        Double total = this.rating * this.totalRatings + newRating;
        this.totalRatings++;
        this.rating = total / this.totalRatings;
    }

    public void startTrip() {
        this.isOnTrip = true;
        this.isAvailable = false;
    }

    public void completeTrip(Double earnings) {
        this.isOnTrip = false;
        this.isAvailable = true;
        this.totalTripsCompleted++;
        this.totalEarnings += earnings;
    }
}