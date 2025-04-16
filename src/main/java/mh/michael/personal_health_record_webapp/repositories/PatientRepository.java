package mh.michael.personal_health_record_webapp.repositories;

import mh.michael.personal_health_record_webapp.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientName(String patientName);
    Optional<Patient> findByPatientUuid(UUID patientUuid);
    Boolean existsByPatientName(String patientName);
}
