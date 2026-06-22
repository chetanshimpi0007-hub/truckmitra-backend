-- Migration V22: Add related_id to notifications

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'notifications' AND column_name = 'related_id'
    ) THEN
        ALTER TABLE notifications ADD COLUMN related_id BIGINT;
    END IF;
END $$;
