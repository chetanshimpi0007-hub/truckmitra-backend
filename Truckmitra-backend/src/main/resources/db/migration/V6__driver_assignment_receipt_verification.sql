-- Migration V6: Create Driver Assignment and Receipt Verification Tables

-- 1. Create Driver Assignment Table
CREATE TABLE IF NOT EXISTS driver_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, ACCEPTED, REJECTED
    remarks VARCHAR(1000),
    assigned_at TIMESTAMP,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (driver_id) REFERENCES users(id)
);

-- 2. Create Receipt Verification Table
CREATE TABLE IF NOT EXISTS receipt_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    receipt_url VARCHAR(2083) NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, APPROVED, REJECTED
    remarks VARCHAR(1000),
    uploaded_at TIMESTAMP,
    verified_at TIMESTAMP,
    verified_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Add Index for foreign keys for performance
CREATE INDEX IF NOT EXISTS idx_driver_assignment_trip ON driver_assignments(trip_id);
CREATE INDEX IF NOT EXISTS idx_driver_assignment_driver ON driver_assignments(driver_id);
CREATE INDEX IF NOT EXISTS idx_receipt_verification_trip ON receipt_verifications(trip_id);

-- 3. Add PDF URL column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS trip_pdf_url VARCHAR(2083);

