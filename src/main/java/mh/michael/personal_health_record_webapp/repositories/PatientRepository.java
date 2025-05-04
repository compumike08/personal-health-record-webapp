package mh.michael.personal_health_record_webapp.repositories;

import java.util.Optional;
import java.util.UUID;
import mh.michael.personal_health_record_webapp.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
  Optional<Patient> findByPatientName(String patientName);
  Optional<Patient> findByPatientUuid(UUID patientUuid);
  Boolean existsByPatientName(String patientName);
}
