-- src/main/resources/db/migration/V13__add_assignment_type_and_statuses.sql
ALTER TABLE loads ADD COLUMN assignment_type VARCHAR(50);
UPDATE loads SET assignment_type = 'OPEN_MARKET' WHERE assignment_type IS NULL;
