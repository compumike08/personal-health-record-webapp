CREATE TABLE lab_result (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    lab_result_uuid uuid NOT NULL UNIQUE default gen_random_uuid(),
    lab_result_name VARCHAR(300) NOT NULL,
    lab_result_date TIMESTAMP NOT NULL,
    lab_result_provider_name VARCHAR(300),
    lab_result_provider_location VARCHAR(500),
    lab_result_value VARCHAR(500),
    lab_result_reference_range VARCHAR(1000),
    lab_result_notes VARCHAR(5000),
    patient_id BIGINT NOT NULL,
    lab_panel_id BIGINT,
    PRIMARY KEY (id)
);

ALTER TABLE lab_result
    ADD CONSTRAINT fk_patient_lab_result FOREIGN KEY (patient_id) REFERENCES patient;

CREATE TABLE lab_panel (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    lab_panel_uuid uuid NOT NULL UNIQUE default gen_random_uuid(),
    lab_panel_name VARCHAR(300) NOT NULL,
    lab_panel_date TIMESTAMP NOT NULL,
    patient_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE lab_panel
    ADD CONSTRAINT fk_patient_lab_panel FOREIGN KEY (patient_id) REFERENCES patient;

ALTER TABLE lab_result
    ADD CONSTRAINT fk_lab_panel_lab_result FOREIGN KEY (lab_panel_id) REFERENCES lab_panel;
