// src/main/java/com/truckmitra/entity/common/enums/TripStatus.java
package com.truckmitra.entity.common.enums;

public enum TripStatus {
    ASSIGNED,
    VEHICLE_ASSIGNED,
    DRIVER_ASSIGNED,
    ACCEPTED_BY_DRIVER,
    ACCEPTED,
    STARTED,
    AT_PICKUP,
    LOADED,
    IN_TRANSIT,
    AT_DESTINATION,
    DELIVERED,
    POD_UPLOADED,
    AWAITING_TRANSPORTER_APPROVAL,
    REJECTED_BY_TRANSPORTER,
    COMPLETED,
    CANCELLED,
    REJECTED,
    REJECTED_BY_DRIVER,
    PAUSED
}