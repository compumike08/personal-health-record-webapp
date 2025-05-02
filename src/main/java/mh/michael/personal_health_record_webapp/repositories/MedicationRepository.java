package mh.michael.personal_health_record_webapp.repositories;

import mh.michael.personal_health_record_webapp.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByPatient_PatientUuidOrderByIsCurrentlyTakingDesc(UUID patientUuid);
    Optional<Medication> findByMedicationUuid(UUID medicationUuid);
}
