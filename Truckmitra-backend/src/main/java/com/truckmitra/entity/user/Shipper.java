// src/main/java/com/truckmitra/entity/user/Shipper.java
package com.truckmitra.entity.user;

import jakarta.persistence.Column;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shippers")  // ← Separate table for shippers
@PrimaryKeyJoinColumn(name = "user_id")
public class Shipper extends User {

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "aadhaar_number")
    private String aadhaarNumber;

    @Column(name = "aadhaar_front_image_url")
    private String aadhaarFrontImageUrl;

    @Column(name = "aadhaar_back_image_url")
    private String aadhaarBackImageUrl;

    @Column(name = "pan_card_image_url")
    private String panCardImageUrl;

    @Column(name = "business_type")
    private String businessType;

    @Column(name = "industry_type")
    private String industryType;

    @Column(name = "company_logo_url")
    private String companyLogoUrl;

    @Column(name = "gst_certificate_url")
    private String gstCertificateUrl;

    @Column(name = "business_proof_url")
    private String businessProofUrl;

    @Column(name = "is_gst_verified")
    @Builder.Default
    private Boolean isGstVerified = false;

    @Column(name = "total_loads_posted")
    @Builder.Default
    private Integer totalLoadsPosted = 0;

    @Column(name = "active_loads")
    @Builder.Default
    private Integer activeLoads = 0;

    @Column(name = "total_spent")
    @Builder.Default
    private Double totalSpent = 0.0;

    @Column(name = "average_rating")
    @Builder.Default
    private Double averageRating = 0.0;

    @Column(name = "total_ratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "free_loads_remaining")
    @Builder.Default
    private Integer freeLoadsRemaining = 2;

    @Column(name = "subscription_start_date")
    private LocalDateTime subscriptionStartDate;

    @Column(name = "subscription_end_date")
    private LocalDateTime subscriptionEndDate;

    @Column(name = "subscription_plan")
    private String subscriptionPlan;

    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "shipper", fetch = FetchType.LAZY)
    @Builder.Default
    private List<com.truckmitra.entity.load.Load> loads = new ArrayList<>();

    public void postLoad() {
        this.totalLoadsPosted++;
        this.activeLoads++;
    }

    public void completeLoad(Double amount) {
        this.activeLoads--;
        this.totalSpent += amount;
    }

    public boolean hasFreeLoads() {
        return this.freeLoadsRemaining > 0;
    }

    public void useFreeLoad() {
        if (hasFreeLoads()) {
            this.freeLoadsRemaining--;
        }
    }
}