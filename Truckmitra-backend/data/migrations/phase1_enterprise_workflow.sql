-- Migration: Phase 1 Enterprise Logistics Workflow
-- Target: Extend trips table and link to Bid, Shipper, Transporter

ALTER TABLE trips ADD COLUMN trip_number VARCHAR(255) UNIQUE;
ALTER TABLE trips ADD COLUMN bid_id BIGINT;
ALTER TABLE trips ADD COLUMN shipper_id BIGINT;
ALTER TABLE trips ADD COLUMN transporter_id BIGINT;
ALTER TABLE trips ADD COLUMN vehicle_id BIGINT;
ALTER TABLE trips ADD COLUMN source VARCHAR(255);
ALTER TABLE trips ADD COLUMN destination VARCHAR(255);
ALTER TABLE trips ADD COLUMN freight_amount DECIMAL(19, 2);
ALTER TABLE trips ADD COLUMN pickup_date DATETIME;
ALTER TABLE trips ADD COLUMN delivery_date DATETIME;
ALTER TABLE trips ADD COLUMN pod_url VARCHAR(500);
ALTER TABLE trips ADD COLUMN pod_signature_url VARCHAR(500);
ALTER TABLE trips ADD COLUMN pod_reference_number VARCHAR(255);
ALTER TABLE trips ADD COLUMN last_location_update DATETIME;

-- Foreign Keys
ALTER TABLE trips ADD CONSTRAINT fk_trip_bid FOREIGN KEY (bid_id) REFERENCES load_bids(id);
ALTER TABLE trips ADD CONSTRAINT fk_trip_shipper FOREIGN KEY (shipper_id) REFERENCES users(id);
ALTER TABLE trips ADD CONSTRAINT fk_trip_transporter FOREIGN KEY (transporter_id) REFERENCES users(id);
ALTER TABLE trips ADD CONSTRAINT fk_trip_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id);

-- Update existing records with default trip numbers if any
UPDATE trips SET trip_number = CONCAT('TRP-OLD-', id) WHERE trip_number IS NULL;
ALTER TABLE trips MODIFY COLUMN trip_number VARCHAR(255) NOT NULL;
