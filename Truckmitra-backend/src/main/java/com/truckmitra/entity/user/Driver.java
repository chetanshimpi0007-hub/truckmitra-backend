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

    @Column(name = "drivinglicenseimageurl")
    private String drivingLicenseImageUrl;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Column(name = "preferredvehicletype")
    @Enumerated(EnumType.STRING)
    private VehicleType preferredVehicleType;

    @Column(name = "aadhaarfrontimageurl")
    private String aadhaarFrontImageUrl;
    @Column(name = "aadhaarbackimageurl")
    private String aadhaarBackImageUrl;
    @Column(name = "pancardimageurl")
    private String panCardImageUrl;
    @Column(name = "aadhaarnumber")
    private String aadhaarNumber;
    @Column(name = "pannumber")
    private String panNumber;

    @Column(name = "vehiclenumber")
    private String vehicleNumber;
    @Column(name = "vehiclecapacity")
    private String vehicleCapacity;
    @Column(name = "vehiclepucimageurl")
    private String vehiclePucImageUrl;
    @Column(name = "vehiclefrontimageurl")
    private String vehicleFrontImageUrl;
    @Column(name = "vehiclebackimageurl")
    private String vehicleBackImageUrl;
    @Column(name = "vehicleinsuranceimageurl")
    private String vehicleInsuranceImageUrl;
    @Column(name = "vehiclefueltype")
    private String vehicleFuelType;

    @Column(name = "currentlatitude")
    private Double currentLatitude;

    @Column(name = "currentlongitude")
    private Double currentLongitude;

    @Column(name = "lastlocationupdate")
    private LocalDateTime lastLocationUpdate;

    @Deprecated
    @Builder.Default
    @Column(name = "isavailable", nullable = false)
    private Boolean isAvailable = true;

    @Deprecated
    @Builder.Default
    @Column(name = "isontrip", nullable = false)
    private Boolean isOnTrip = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    @Builder.Default
    private DriverAvailabilityStatus availabilityStatus = DriverAvailabilityStatus.AVAILABLE;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(name = "totaltripscompleted")
    @Builder.Default
    private Integer totalTripsCompleted = 0;

    @Column(name = "totalearnings")
    @Builder.Default
    private Double totalEarnings = 0.0;

    @Builder.Default
    private Double rating = 0.0;

    @Column(name = "totalratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "transporter_id")
    private Long transporterId;

    // Bank details
    @Column(name = "accountholdername")
    private String accountHolderName;

    @Column(name = "bankname")
    private String bankName;

    @Column(name = "accountnumber")
    private String accountNumber;

    @Column(name = "ifsccode")
    private String ifscCode;

    @Column(name = "upiid")
    private String upiId;

    // Emergency contact
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_number", length = 10)
    private String emergencyContactNumber;

    // Preferences
    @Column(name = "availableforlongroute")
    @Builder.Default
    private Boolean availableForLongRoute = true;

    @Column(name = "availableforlocalroute")
    @Builder.Default
    private Boolean availableForLocalRoute = true;

    @Column(name = "minimumadvancerequired")
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