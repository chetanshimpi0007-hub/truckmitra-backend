-- Add missing columns to trip_invoices
ALTER TABLE trip_invoices
ADD COLUMN IF NOT EXISTS shipper_id BIGINT,
ADD COLUMN IF NOT EXISTS transporter_id BIGINT,
ADD COLUMN IF NOT EXISTS driver_id BIGINT,
ADD COLUMN IF NOT EXISTS vehicle_id BIGINT,
ADD COLUMN IF NOT EXISTS amount DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS gst_amount DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS invoice_status VARCHAR(255);

-- Add missing columns to subscription_plans
ALTER TABLE subscription_plans
ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(50),
ADD COLUMN IF NOT EXISTS razorpay_plan_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS max_drivers INT;

-- Add missing columns to shippers
ALTER TABLE shippers
ADD COLUMN IF NOT EXISTS verified_by BIGINT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;

-- Add missing columns to transporters
ALTER TABLE transporters
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
