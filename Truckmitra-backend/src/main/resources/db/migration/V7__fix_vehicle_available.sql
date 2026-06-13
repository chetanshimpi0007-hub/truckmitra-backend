-- Migration V7: Fix Vehicle Availability
UPDATE vehicles
SET isAvailable = true
WHERE isAvailable IS NULL;
