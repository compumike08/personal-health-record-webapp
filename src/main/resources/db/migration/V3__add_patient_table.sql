CREATE TABLE patient (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    patient_uuid uuid NOT NULL UNIQUE default gen_random_uuid(),
    patient_name VARCHAR(300) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE patient_user (
    user_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, patient_id)
);

ALTER TABLE patient_user
    ADD CONSTRAINT fk_patient_user_patient FOREIGN KEY (patient_id) REFERENCES patient;

ALTER TABLE patient_user
    ADD CONSTRAINT fk_patient_user_user_record FOREIGN KEY (user_id) REFERENCES user_record;
