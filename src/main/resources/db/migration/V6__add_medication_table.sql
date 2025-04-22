CREATE TABLE medication (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    medication_name VARCHAR(500) NOT NULL,
    is_currently_taking BOOLEAN NOT NULL,
    medication_start_date TIMESTAMP,
    medication_end_date TIMESTAMP,
    dosage float8,
    dosage_unit VARCHAR(100),
    notes VARCHAR(5000),
    patient_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE medication
    ADD CONSTRAINT fk_patient_medication FOREIGN KEY (patient_id) REFERENCES patient;
