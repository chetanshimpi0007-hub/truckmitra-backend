-- Migration V11: Add trip_photos table and audit trail columns
-- Requirement: Implement Pickup & Delivery Photo Approval Workflow

-- 1. Create trip_photos table
CREATE TABLE IF NOT EXISTS trip_photos (
    id SERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    photo_type VARCHAR(20) NOT NULL, -- 'PICKUP' or 'DESTINATION'
    photo_url VARCHAR(2083) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by BIGINT,
    approval_status VARCHAR(20), -- e.g., 'PENDING', 'APPROVED', 'REJECTED'
    rejection_reason VARCHAR(1000),
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (driver_id) REFERENCES users(id)
);

-- 2. Add audit trail columns to proof_of_delivery
ALTER TABLE proof_of_delivery ADD COLUMN IF NOT EXISTS uploaded_by BIGINT;
ALTER TABLE proof_of_delivery ADD COLUMN IF NOT EXISTS approved_by BIGINT;
ALTER TABLE proof_of_delivery ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE proof_of_delivery ADD COLUMN IF NOT EXISTS rejected_by BIGINT;
ALTER TABLE proof_of_delivery ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;

-- 3. Add audit trail columns to trips (for rejection tracking)
ALTER TABLE trips ADD COLUMN IF NOT EXISTS rejected_by BIGINT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;

-- 4. Rename verification rejected status if it exists
UPDATE trips SET status = 'REJECTED_BY_TRANSPORTER' WHERE status = 'VERIFICATION_REJECTED';
