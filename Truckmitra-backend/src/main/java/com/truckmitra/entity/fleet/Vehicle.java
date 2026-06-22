package com.truckmitra.entity.fleet;

import jakarta.persistence.Column;
import com.truckmitra.entity.common.BaseEntity;
import com.truckmitra.entity.user.Transporter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicles")
@SQLDelete(sql = "UPDATE vehicles SET is_deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "is_deleted = false")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Vehicle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_number", nullable = false, unique = true)
    private String vehicleNumber; // Plate Number

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType; // e.g., TATA ACE, TRUCK 10T

    @Column(nullable = false)
    private Double capacity; // in Tons

    @Column(name = "rc_number")
    private String rcNumber;
    
    private String model;
    
    private String manufacturer;

    @Column(name = "insurance_number")
    private String insuranceNumber;
    
    @Column(name = "insurance_expiry")
    private LocalDate insuranceExpiry;

    @Column(name = "fitness_certificate_number")
    private String fitnessCertificateNumber;
    
    @Column(name = "fitness_expiry")
    private LocalDate fitnessExpiry;

    @Column(name = "permit_number")
    private String permitNumber;
    
    @Column(name = "permit_expiry")
    private LocalDate permitExpiry;

    @Column(name = "pollution_certificate_number")
    private String pollutionCertificateNumber;
    
    @Column(name = "pollution_expiry")
    private LocalDate pollutionExpiry;

    @Column(name = "is_available")
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "average_mileage")
    private Double averageMileage;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id")
    private Transporter transporter;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private com.truckmitra.entity.user.Driver driver;

    @Column(name = "vehicle_front_image_url")
    private String vehicleFrontImageUrl;
    @Column(name = "vehicle_back_image_url")
    private String vehicleBackImageUrl;
    @Column(name = "vehicle_rc_image_url")
    private String vehicleRcImageUrl;

    @PrePersist
    protected void ensureAvailability() {
        if (this.isAvailable == null) {
            this.isAvailable = true;
        }
    }
}
