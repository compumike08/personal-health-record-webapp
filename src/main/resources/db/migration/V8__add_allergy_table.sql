CREATE TABLE allergy (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    allergy_uuid uuid NOT NULL UNIQUE default gen_random_uuid(),
    allergy_name VARCHAR(500) NOT NULL,
    is_current_allergy BOOLEAN NOT NULL,
    allergy_started_date TIMESTAMP,
    allergy_ended_date TIMESTAMP,
    description VARCHAR(5000),
    patient_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE allergy
    ADD CONSTRAINT fk_patient_medication FOREIGN KEY (patient_id) REFERENCES patient;
