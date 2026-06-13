-- Phase 5: Database Optimization Migration
-- NOTE: All application tables (users, loads, trips, bids, wallets, notifications, vehicles)
--       are managed by Hibernate ddl-auto=update which runs AFTER Flyway.
--       Indexes on those tables must be defined via @Index annotations on JPA entities,
--       not here. Only tables created by Flyway migrations (audit_logs, chat_messages,
--       enterprise_settings) are safe to index here.

-- Audit Log Indexes (audit_logs created in V4 by Flyway)
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- Chat Messages Indexes (chat_messages created in V1 by Flyway)
CREATE INDEX IF NOT EXISTS idx_chat_from_user ON chat_messages(from_user);
CREATE INDEX IF NOT EXISTS idx_chat_to_user ON chat_messages(to_user);
CREATE INDEX IF NOT EXISTS idx_chat_timestamp ON chat_messages(timestamp);
