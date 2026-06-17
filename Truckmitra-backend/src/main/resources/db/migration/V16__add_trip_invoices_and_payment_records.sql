CREATE TABLE trip_invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(255) NOT NULL UNIQUE,
    trip_id BIGINT NOT NULL,
    total_amount DOUBLE PRECISION NOT NULL,
    paid_amount DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    pending_amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    pdf_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_trip_invoice_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE payment_records (
    id SERIAL PRIMARY KEY,
    trip_invoice_id BIGINT NOT NULL,
    amount_paid DOUBLE PRECISION NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    payment_method VARCHAR(100),
    transaction_id VARCHAR(255) UNIQUE,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_payment_record_trip_invoice FOREIGN KEY (trip_invoice_id) REFERENCES trip_invoices(id)
);
