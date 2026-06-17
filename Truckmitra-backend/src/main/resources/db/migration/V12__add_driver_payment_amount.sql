-- V12__add_driver_payment_amount.sql
ALTER TABLE trips ADD COLUMN shipper_amount NUMERIC(38,2);
ALTER TABLE trips ADD COLUMN driver_amount NUMERIC(38,2);
