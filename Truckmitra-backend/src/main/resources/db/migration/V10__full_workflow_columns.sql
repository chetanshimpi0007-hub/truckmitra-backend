-- Migration V10: Full Workflow - Route Intelligence Columns + Delivery Workflow
-- Adds new columns needed for OSRM route data, delivery submission, transporter approval, and driver resubmission.

-- Route Intelligence columns (OSRM results)
ALTER TABLE trips ADD COLUMN IF NOT EXISTS estimatedTravelTimeMins INT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS tollPlazaCount INT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS estimatedTollCost DECIMAL(12,2);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS fuelEstimateLiters DECIMAL(10,2);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS sourceLatitude DOUBLE PRECISION;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS sourceLongitude DOUBLE PRECISION;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS destinationLatitude DOUBLE PRECISION;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS destinationLongitude DOUBLE PRECISION;

-- Workflow document URLs
ALTER TABLE trips ADD COLUMN IF NOT EXISTS assignmentPdfUrl VARCHAR(2083);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS finalInvoicePdfUrl VARCHAR(2083);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS pickupReceiptUrl VARCHAR(2083);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS deliveryReceiptUrl VARCHAR(2083);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS rejectionReason VARCHAR(2000);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS locationEnabled BOOLEAN DEFAULT FALSE;

-- Ensure trip status column is wide enough for new enum values
-- (already VARCHAR(50) from V8, but confirm AWAITING_TRANSPORTER_APPROVAL fits)
-- AWAITING_TRANSPORTER_APPROVAL = 30 chars, well within 50

-- Update existing trips missing required fields to safe defaults
UPDATE trips SET locationEnabled = FALSE WHERE locationEnabled IS NULL;
