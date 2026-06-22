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

    @Column(name = "companyname", nullable = false)
    private String companyName;

    @Column(name = "gstnumber")
    private String gstNumber;

    @Column(name = "pannumber")
    private String panNumber;

    @Column(name = "aadhaarnumber")
    private String aadhaarNumber;

    @Column(name = "aadhaarfrontimageurl")
    private String aadhaarFrontImageUrl;

    @Column(name = "aadhaarbackimageurl")
    private String aadhaarBackImageUrl;

    @Column(name = "pancardimageurl")
    private String panCardImageUrl;

    @Column(name = "businesstype")
    private String businessType;

    @Column(name = "industrytype")
    private String industryType;

    @Column(name = "companylogourl")
    private String companyLogoUrl;

    @Column(name = "gstcertificateurl")
    private String gstCertificateUrl;

    @Column(name = "businessproofurl")
    private String businessProofUrl;

    @Column(name = "isgstverified")
    @Builder.Default
    private Boolean isGstVerified = false;

    @Column(name = "totalloadsposted")
    @Builder.Default
    private Integer totalLoadsPosted = 0;

    @Column(name = "activeloads")
    @Builder.Default
    private Integer activeLoads = 0;

    @Column(name = "totalspent")
    @Builder.Default
    private Double totalSpent = 0.0;

    @Column(name = "averagerating")
    @Builder.Default
    private Double averageRating = 0.0;

    @Column(name = "totalratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "freeloadsremaining")
    @Builder.Default
    private Integer freeLoadsRemaining = 2;

    @Column(name = "subscriptionstartdate")
    private LocalDateTime subscriptionStartDate;

    @Column(name = "subscriptionenddate")
    private LocalDateTime subscriptionEndDate;

    @Column(name = "subscriptionplan")
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