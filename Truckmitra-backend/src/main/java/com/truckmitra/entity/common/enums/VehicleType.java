// src/main/java/com/truckmitra/entity/common/enums/VehicleType.java
package com.truckmitra.entity.common.enums;

import java.math.BigDecimal;

public enum VehicleType {
    PICKUP("Pickup", 1.5, 2.0, "Small pickup truck for local delivery"),
    LCV("LCV", 3.0, 5.0, "Light Commercial Vehicle - Tata 407 etc"),
    TRUCK_10_WHEEL("10 Wheeler", 15.0, 20.0, "10-wheel truck for medium loads"),
    TRUCK_14_WHEEL("14 Wheeler", 20.0, 25.0, "14-wheel truck for heavy loads"),
    CONTAINER_20("20ft Container", 18.0, 22.0, "20 feet container"),
    CONTAINER_40("40ft Container", 25.0, 30.0, "40 feet container"),
    TRAILER("Trailer", 30.0, 40.0, "Multi-axle trailer for heavy cargo"),
    TIPPER("Tipper", 15.0, 25.0, "For construction material"),
    OPEN_BODY("Open Body", 10.0, 20.0, "Open truck for general goods"),
    REFRIGERATED("Refrigerated", 5.0, 15.0, "Cold storage container");

    private final String displayName;
    private final double minCapacity;
    private final double maxCapacity;
    private final String description;

    VehicleType(String displayName, double minCapacity, double maxCapacity, String description) {
        this.displayName = displayName;
        this.minCapacity = minCapacity;
        this.maxCapacity = maxCapacity;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getMinCapacity() {
        return minCapacity;
    }

    public double getMaxCapacity() {
        return maxCapacity;
    }

    public String getDescription() {
        return description;
    }

    public boolean canHandleWeight(double weightInTons) {
        return weightInTons >= minCapacity && weightInTons <= maxCapacity;
    }
}