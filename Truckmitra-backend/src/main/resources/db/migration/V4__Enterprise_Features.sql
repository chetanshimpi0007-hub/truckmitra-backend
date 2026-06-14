-- Phase 4: Enterprise & SaaS Features Migration

-- 1. Enterprise Settings Table
DROP TABLE IF EXISTS enterprise_settings CASCADE;
CREATE TABLE IF NOT EXISTS enterprise_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(100),
    company_logo TEXT,
    gst_number VARCHAR(20),
    company_address TEXT,
    invoice_prefix VARCHAR(10),
    theme_colors VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default platform settings (PostgreSQL upsert)
INSERT INTO enterprise_settings (setting_key, company_name, invoice_prefix, theme_colors)
VALUES ('GLOBAL_PLATFORM', 'TruckMitra Logistics', 'TM', '#1E3A8A')
ON CONFLICT (setting_key) 
DO UPDATE SET 
    company_name = EXCLUDED.company_name, 
    invoice_prefix = EXCLUDED.invoice_prefix, 
    theme_colors = EXCLUDED.theme_colors;

-- 2. Invoice Enhancements (Snapshots) - handled by Hibernate ddl-auto=update
--    (invoices table does not exist at Flyway migration time; columns are added by JPA entity mapping)


-- 3. Soft Delete Columns - handled by Hibernate ddl-auto=update
--    (vehicles table is JPA-managed; is_deleted, deleted_at, created_at, updated_at are entity fields)


-- 4. Subscription Plan Updates (if needed - reusing existing)
-- Ensure limits are present
-- ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS load_post_limit INTEGER DEFAULT 5;
-- ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS bid_limit INTEGER DEFAULT 10;
-- ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS fleet_limit INTEGER DEFAULT 3;

-- 5. Audit Log (Ensuring consistency)
-- (Assuming audit_logs table already exists based on AuditService usage)
-- If not:
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100),
    module VARCHAR(50),
    details TEXT,
    user_id BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
