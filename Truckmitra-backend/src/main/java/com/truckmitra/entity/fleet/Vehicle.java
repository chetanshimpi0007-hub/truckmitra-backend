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

    @Column(name = "vehiclenumber", nullable = false, unique = true)
    private String vehicleNumber; // Plate Number

    @Column(name = "vehicletype", nullable = false)
    private String vehicleType; // e.g., TATA ACE, TRUCK 10T

    @Column(nullable = false)
    private Double capacity; // in Tons

    @Column(name = "rcnumber")
    private String rcNumber;
    
    private String model;
    
    private String manufacturer;

    @Column(name = "insurancenumber")
    private String insuranceNumber;
    
    @Column(name = "insuranceexpiry")
    private LocalDate insuranceExpiry;

    @Column(name = "fitnesscertificatenumber")
    private String fitnessCertificateNumber;
    
    @Column(name = "fitnessexpiry")
    private LocalDate fitnessExpiry;

    @Column(name = "permitnumber")
    private String permitNumber;
    
    @Column(name = "permitexpiry")
    private LocalDate permitExpiry;

    @Column(name = "pollutioncertificatenumber")
    private String pollutionCertificateNumber;
    
    @Column(name = "pollutionexpiry")
    private LocalDate pollutionExpiry;

    @Column(name = "isavailable")
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

    @Column(name = "vehiclefrontimageurl")
    private String vehicleFrontImageUrl;
    @Column(name = "vehiclebackimageurl")
    private String vehicleBackImageUrl;
    @Column(name = "vehiclercimageurl")
    private String vehicleRcImageUrl;

    @PrePersist
    protected void ensureAvailability() {
        if (this.isAvailable == null) {
            this.isAvailable = true;
        }
    }
}
