-- Migration V21: AI Load Matching Engine Tables

CREATE TABLE IF NOT EXISTS transporter_preferences (
    id BIGSERIAL PRIMARY KEY,
    transporter_id BIGINT NOT NULL UNIQUE,
    preferred_pickup_cities VARCHAR(1000),
    preferred_destination_cities VARCHAR(1000),
    vehicle_types VARCHAR(1000),
    min_weight DOUBLE PRECISION,
    max_weight DOUBLE PRECISION,
    preferred_routes VARCHAR(1000),
    max_distance_radius DOUBLE PRECISION,
    preferred_trip_frequency INT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pref_transporter ON transporter_preferences(transporter_id);

CREATE TABLE IF NOT EXISTS load_recommendations (
    id BIGSERIAL PRIMARY KEY,
    load_id BIGINT NOT NULL,
    transporter_id BIGINT NOT NULL,
    match_score DOUBLE PRECISION NOT NULL,
    confidence_percentage DOUBLE PRECISION NOT NULL,
    recommendation_reason VARCHAR(1000),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rec_load ON load_recommendations(load_id);
CREATE INDEX IF NOT EXISTS idx_rec_transporter ON load_recommendations(transporter_id);
CREATE INDEX IF NOT EXISTS idx_rec_score ON load_recommendations(match_score);
