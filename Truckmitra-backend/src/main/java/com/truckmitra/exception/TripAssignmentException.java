// src/main/java/com/truckmitra/exception/TripAssignmentException.java
package com.truckmitra.exception;

public class TripAssignmentException extends RuntimeException {
    
    private final Long tripId;
    private final Long driverId;
    private final String reason;

    public TripAssignmentException(String message) {
        super(message);
        this.tripId = null;
        this.driverId = null;
        this.reason = null;
    }

    public TripAssignmentException(String message, Long tripId, Long driverId, String reason) {
        super(String.format("%s - Trip: %d, Driver: %d, Reason: %s", message, tripId, driverId, reason));
        this.tripId = tripId;
        this.driverId = driverId;
        this.reason = reason;
    }

    public Long getTripId() {
        return tripId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public String getReason() {
        return reason;
    }
}