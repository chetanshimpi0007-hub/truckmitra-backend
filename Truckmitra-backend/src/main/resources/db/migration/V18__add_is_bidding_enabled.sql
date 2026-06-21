-- Add is_bidding_enabled column to loads table
ALTER TABLE loads ADD COLUMN IF NOT EXISTS is_bidding_enabled BOOLEAN DEFAULT true;
UPDATE loads SET is_bidding_enabled = true WHERE is_bidding_enabled IS NULL;
