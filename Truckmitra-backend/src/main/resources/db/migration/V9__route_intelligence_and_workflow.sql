-- Migration V9: Route Intelligence and Driver Workflow Requirements

-- 1. Add Route Intelligence fields to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS estimatedTravelTimeMins INT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS tollPlazaCount INT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS estimatedTollCost DECIMAL(10,2);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS fuelEstimateLiters DECIMAL(10,2);
-- carbonEmission already exists as carbon_emission in V1

-- 2. Add Workflow and PDF tracking fields to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS assignmentPdfUrl VARCHAR(2083);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS finalInvoicePdfUrl VARCHAR(2083);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS pickupReceiptUrl VARCHAR(2083);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS deliveryReceiptUrl VARCHAR(2083);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS rejectionReason VARCHAR(1000);

-- Since status was altered to VARCHAR(50) in V8, we don't need to alter it again for new enum values like AWAITING_TRANSPORTER_APPROVAL or VERIFICATION_REJECTED.
