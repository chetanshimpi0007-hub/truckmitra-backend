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

    @Column(name = "driver_id", nullable = false)
    private Long driverId;

    @Column(name = "document_type", nullable = false, length = 50)
    private String documentType; // DRIVING_LICENSE, AADHAAR, PAN, VOTER_ID

    @Column(name = "document_number", nullable = false)
    private String documentNumber;

    @Column(name = "document_image_url")
    private String documentImageUrl;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "verification_status", nullable = false, length = 20)
    private String verificationStatus = "PENDING"; // PENDING, VERIFIED, REJECTED

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "verified_by")
    private Long verifiedBy; // Admin ID

    @Column(name = "verified_at")
    private LocalDate verifiedAt;

    @Column(name = "is_expired", nullable = false)
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