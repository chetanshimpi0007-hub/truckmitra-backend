// src/main/java/com/truckmitra/entity/user/DriverDocument.java
package com.truckmitra.entity.user;

import com.truckmitra.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "driver_documents")
public class DriverDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long driverId;

    @Column(nullable = false, length = 50)
    private String documentType; // DRIVING_LICENSE, AADHAAR, PAN, VOTER_ID

    @Column(nullable = false)
    private String documentNumber;

    private String documentImageUrl;

    private LocalDate issueDate;

    private LocalDate expiryDate;

    @Column(nullable = false, length = 20)
    private String verificationStatus = "PENDING"; // PENDING, VERIFIED, REJECTED

    private String rejectionReason;

    private Long verifiedBy; // Admin ID

    private LocalDate verifiedAt;

    @Column(nullable = false)
    private Boolean isExpired = false;

    @PrePersist
    @PreUpdate
    public void checkExpiry() {
        if (expiryDate != null && expiryDate.isBefore(LocalDate.now())) {
            this.isExpired = true;
            this.verificationStatus = "EXPIRED";
        }
    }
}