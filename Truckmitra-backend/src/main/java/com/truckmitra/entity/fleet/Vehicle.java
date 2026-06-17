package com.truckmitra.entity.fleet;

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

    @Column(nullable = false, unique = true)
    private String vehicleNumber; // Plate Number

    @Column(nullable = false)
    private String vehicleType; // e.g., TATA ACE, TRUCK 10T

    @Column(nullable = false)
    private Double capacity; // in Tons

    private String rcNumber;
    
    private String model;
    
    private String manufacturer;

    private String insuranceNumber;
    
    private LocalDate insuranceExpiry;

    private String fitnessCertificateNumber;
    
    private LocalDate fitnessExpiry;

    private String permitNumber;
    
    private LocalDate permitExpiry;

    private String pollutionCertificateNumber;
    
    private LocalDate pollutionExpiry;

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

    private String vehicleFrontImageUrl;
    private String vehicleBackImageUrl;
    private String vehicleRcImageUrl;

    @PrePersist
    protected void ensureAvailability() {
        if (this.isAvailable == null) {
            this.isAvailable = true;
        }
    }
}
