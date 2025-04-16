ALTER TABLE patient
    ADD CONSTRAINT unique_patient_name_constraint UNIQUE (patient_name);
