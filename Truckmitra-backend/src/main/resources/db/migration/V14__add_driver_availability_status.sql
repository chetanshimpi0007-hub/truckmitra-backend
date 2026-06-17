-- Add availability_status and last_seen_at to drivers table
ALTER TABLE drivers ADD COLUMN availability_status VARCHAR(50);
ALTER TABLE drivers ADD COLUMN last_seen_at TIMESTAMP;

-- Backfill availability_status
UPDATE drivers
SET availability_status = 'ON_TRIP'
WHERE isontrip = true;

UPDATE drivers
SET availability_status = 'AVAILABLE'
WHERE isavailable = true AND isontrip = false;

UPDATE drivers
SET availability_status = 'OFFLINE'
WHERE isavailable = false AND isontrip = false;

-- Add check constraint for valid enum values (optional but good practice)
-- Postgres syntax or generic standard depending on DB. Assuming generic/postgres:
-- ALTER TABLE drivers ADD CONSTRAINT chk_driver_availability CHECK (availability_status IN ('AVAILABLE', 'ON_TRIP', 'OFFLINE'));
