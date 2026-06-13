-- Flyway baseline: create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  from_user BIGINT,
  to_user BIGINT,
  message TEXT,
  timestamp TIMESTAMP
);
