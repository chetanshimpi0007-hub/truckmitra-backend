-- Migration: Phase 2 Driver Workflow, GPS Tracking, and POD
-- Target: trip_locations and proof_of_delivery tables

CREATE TABLE IF NOT EXISTS trip_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    speed DOUBLE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_location_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS proof_of_delivery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL UNIQUE,
    image_url VARCHAR(500),
    signature_url VARCHAR(500),
    remarks TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    pod_reference_number VARCHAR(255),
    CONSTRAINT fk_pod_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- Update trips table for POD tracking
ALTER TABLE trips ADD COLUMN start_photo_url VARCHAR(500);
ALTER TABLE trips ADD COLUMN pod_signature_url VARCHAR(500);
ALTER TABLE trips ADD COLUMN pod_reference_number VARCHAR(255);
ALTER TABLE trips ADD COLUMN last_location_update DATETIME;
