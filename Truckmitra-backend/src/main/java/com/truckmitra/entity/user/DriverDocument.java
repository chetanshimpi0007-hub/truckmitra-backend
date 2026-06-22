// src/main/java/com/truckmitra/entity/user/DriverDocument.java
package com.truckmitra.entity.user;

import jakarta.persistence.Column;
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

    @Column(name = "driverid", nullable = false)
    private Long driverId;

    @Column(name = "documenttype", nullable = false, length = 50)
    private String documentType; // DRIVING_LICENSE, AADHAAR, PAN, VOTER_ID

    @Column(name = "documentnumber", nullable = false)
    private String documentNumber;

    @Column(name = "documentimageurl")
    private String documentImageUrl;

    @Column(name = "issuedate")
    private LocalDate issueDate;

    @Column(name = "expirydate")
    private LocalDate expiryDate;

    @Column(name = "verificationstatus", nullable = false, length = 20)
    private String verificationStatus = "PENDING"; // PENDING, VERIFIED, REJECTED

    @Column(name = "rejectionreason")
    private String rejectionReason;

    @Column(name = "verifiedby")
    private Long verifiedBy; // Admin ID

    @Column(name = "verifiedat")
    private LocalDate verifiedAt;

    @Column(name = "isexpired", nullable = false)
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