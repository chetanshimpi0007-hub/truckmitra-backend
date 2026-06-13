// src/main/java/com/truckmitra/entity/user/Shipper.java
package com.truckmitra.entity.user;

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

    @Column(nullable = false)
    private String companyName;

    private String gstNumber;

    private String panNumber;

    private String aadhaarNumber;

    private String aadhaarFrontImageUrl;

    private String aadhaarBackImageUrl;

    private String panCardImageUrl;

    private String businessType;

    private String industryType;

    private String companyLogoUrl;

    private String gstCertificateUrl;

    private String businessProofUrl;

    @Builder.Default
    private Boolean isGstVerified = false;

    @Builder.Default
    private Integer totalLoadsPosted = 0;

    @Builder.Default
    private Integer activeLoads = 0;

    @Builder.Default
    private Double totalSpent = 0.0;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer totalRatings = 0;

    private Long verifiedBy;

    private LocalDateTime verifiedAt;

    @Builder.Default
    private Integer freeLoadsRemaining = 2;

    private LocalDateTime subscriptionStartDate;

    private LocalDateTime subscriptionEndDate;

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