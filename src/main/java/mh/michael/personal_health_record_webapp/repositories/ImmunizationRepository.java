package mh.michael.personal_health_record_webapp.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import mh.michael.personal_health_record_webapp.model.Immunization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImmunizationRepository extends JpaRepository<Immunization, Long> {
  List<Immunization> findByPatient_PatientUuidOrderByImmunizationDateDesc(
    UUID patientUuid
  );
  Optional<Immunization> findByImmunizationUuid(UUID immunizationUuid);
}
