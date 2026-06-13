package com.truckmitra.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;

public class LoadDto {

    @NotBlank
    private String refNo;

    @NotNull
    @Positive
    private Double weight;

    @NotNull
    private Instant pickupDate;

    // optional fields
    private String pickupLocation;
    private String deliveryLocation;
    private String loadType;
    private String paymentType;

    // getters/setters
    public String getRefNo() { return refNo; }
    public void setRefNo(String refNo) { this.refNo = refNo; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Instant getPickupDate() { return pickupDate; }
    public void setPickupDate(Instant pickupDate) { this.pickupDate = pickupDate; }
    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }
    public String getLoadType() { return loadType; }
    public void setLoadType(String loadType) { this.loadType = loadType; }
    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
}
