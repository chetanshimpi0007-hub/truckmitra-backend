// src/main/java/com/truckmitra/entity/user/Driver.java
package com.truckmitra.entity.user;

import jakarta.persistence.Column;
import com.truckmitra.entity.common.enums.VehicleType;
import com.truckmitra.entity.common.enums.DriverAvailabilityStatus;
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

    @Column(name = "driving_license_image_url")
    private String drivingLicenseImageUrl;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Column(name = "preferred_vehicle_type")
    @Enumerated(EnumType.STRING)
    private VehicleType preferredVehicleType;

    @Column(name = "aadhaar_front_image_url")
    private String aadhaarFrontImageUrl;
    @Column(name = "aadhaar_back_image_url")
    private String aadhaarBackImageUrl;
    @Column(name = "pan_card_image_url")
    private String panCardImageUrl;
    @Column(name = "aadhaar_number")
    private String aadhaarNumber;
    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "vehicle_number")
    private String vehicleNumber;
    @Column(name = "vehicle_capacity")
    private String vehicleCapacity;
    @Column(name = "vehicle_puc_image_url")
    private String vehiclePucImageUrl;
    @Column(name = "vehicle_front_image_url")
    private String vehicleFrontImageUrl;
    @Column(name = "vehicle_back_image_url")
    private String vehicleBackImageUrl;
    @Column(name = "vehicle_insurance_image_url")
    private String vehicleInsuranceImageUrl;
    @Column(name = "vehicle_fuel_type")
    private String vehicleFuelType;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @Column(name = "last_location_update")
    private LocalDateTime lastLocationUpdate;

    @Deprecated
    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Deprecated
    @Builder.Default
    @Column(name = "is_on_trip", nullable = false)
    private Boolean isOnTrip = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    @Builder.Default
    private DriverAvailabilityStatus availabilityStatus = DriverAvailabilityStatus.AVAILABLE;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(name = "total_trips_completed")
    @Builder.Default
    private Integer totalTripsCompleted = 0;

    @Column(name = "total_earnings")
    @Builder.Default
    private Double totalEarnings = 0.0;

    @Builder.Default
    private Double rating = 0.0;

    @Column(name = "total_ratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "transporter_id")
    private Long transporterId;

    // Bank details
    @Column(name = "account_holder_name")
    private String accountHolderName;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "upi_id")
    private String upiId;

    // Emergency contact
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_number", length = 10)
    private String emergencyContactNumber;

    // Preferences
    @Column(name = "available_for_long_route")
    @Builder.Default
    private Boolean availableForLongRoute = true;

    @Column(name = "available_for_local_route")
    @Builder.Default
    private Boolean availableForLocalRoute = true;

    @Column(name = "minimum_advance_required")
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
        this.availabilityStatus = DriverAvailabilityStatus.ON_TRIP;
    }

    public void completeTrip(Double earnings) {
        this.isOnTrip = false;
        this.isAvailable = true;
        this.availabilityStatus = DriverAvailabilityStatus.AVAILABLE;
        this.totalTripsCompleted++;
        this.totalEarnings += earnings;
    }
}