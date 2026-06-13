-- V4__SaaS_Features.sql
-- Module 1: Subscription Plans Initialization
INSERT INTO subscription_plans (name, description, price, load_post_limit, bid_limit, fleet_limit, has_analytics, has_voice_assistant)
VALUES 
('FREE', 'Trial plan for small operators', 0.0, 5, 20, 2, false, false),
('BASIC', 'Standard plan for growing businesses', 1999.0, 50, 200, 10, true, false),
('PRO', 'Advanced features for enterprise logistics', 4999.0, -1, -1, -1, true, true),
('ENTERPRISE', 'Full white-label solution for logistics brands', 9999.0, -1, -1, -1, true, true)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    load_post_limit = EXCLUDED.load_post_limit,
    bid_limit = EXCLUDED.bid_limit,
    fleet_limit = EXCLUDED.fleet_limit,
    has_analytics = EXCLUDED.has_analytics,
    has_voice_assistant = EXCLUDED.has_voice_assistant;

-- Module 2: Billing & Invoices
CREATE TABLE IF NOT EXISTS billing_details (
    id SERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id),
    company_name VARCHAR(255),
    gst_number VARCHAR(50),
    company_address TEXT,
    invoice_prefix VARCHAR(10) DEFAULT 'TM',
    theme_colors TEXT, -- JSON string
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE,
    user_id BIGINT REFERENCES users(id),
    subscription_id BIGINT REFERENCES user_subscriptions(id),
    plan_name VARCHAR(50),
    amount DOUBLE PRECISION,
    gst_amount DOUBLE PRECISION,
    gst_rate DOUBLE PRECISION DEFAULT 18.0,
    total_amount DOUBLE PRECISION,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PAID, CANCELLED
    pdf_url TEXT,
    billing_date DATE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module 7: Soft Delete Framework
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE loads ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE loads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE drivers ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
