-- Add average_mileage to vehicles table
ALTER TABLE vehicles ADD COLUMN average_mileage DOUBLE PRECISION;

-- Default existing vehicles to a sensible mileage (e.g. 4.0 km/l)
UPDATE vehicles
SET average_mileage = 4.0
WHERE average_mileage IS NULL;

-- Add estimated_distance_km to loads table
ALTER TABLE loads ADD COLUMN estimated_distance_km DOUBLE PRECISION;

-- We don't default distance on old loads because it might be null if not provided
