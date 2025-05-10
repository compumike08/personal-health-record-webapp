package mh.michael.personal_health_record_webapp.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import mh.michael.personal_health_record_webapp.model.Allergy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AllergyRepository extends JpaRepository<Allergy, Long> {
  List<Allergy> findByPatient_PatientUuidOrderByIsCurrentAllergyDesc(UUID patientUuid);
  Optional<Allergy> findByAllergyUuid(UUID allergyUuid);
}
