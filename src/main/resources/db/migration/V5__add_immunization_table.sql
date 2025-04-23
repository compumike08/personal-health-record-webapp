CREATE TABLE immunization (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    immunization_uuid uuid NOT NULL UNIQUE default gen_random_uuid(),
    immunization_date TIMESTAMP NOT NULL,
    immunization_name VARCHAR(300) NOT NULL,
    provider_name VARCHAR(300),
    provider_location VARCHAR(500),
    description VARCHAR(5000),
    patient_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE immunization
    ADD CONSTRAINT fk_patient_immunization FOREIGN KEY (patient_id) REFERENCES patient;
