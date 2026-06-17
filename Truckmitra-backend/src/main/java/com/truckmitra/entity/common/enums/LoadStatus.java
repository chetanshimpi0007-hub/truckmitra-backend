// src/main/java/com/truckmitra/entity/common/enums/LoadStatus.java
package com.truckmitra.entity.common.enums;

public enum LoadStatus {
    PENDING,        // Posted, waiting for assignment or bids
    ASSIGNED,       // Assigned to a transporter
    IN_TRANSIT,     // Trip started
    COMPLETED,      // Trip finished and receipt accepted
    CANCELLED,      // Cancelled by shipper or admin
    DRAFT,          // Direct assignment draft
    PENDING_ACCEPTANCE, // Direct assignment waiting for transporter
    ACCEPTED,       // Transporter accepted
    DRIVER_ASSIGNMENT_PENDING, // Transporter accepted, waiting for driver
    REJECTED        // Transporter rejected
}
