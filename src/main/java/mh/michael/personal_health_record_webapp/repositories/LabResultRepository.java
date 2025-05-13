package mh.michael.personal_health_record_webapp.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import mh.michael.personal_health_record_webapp.model.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabResultRepository extends JpaRepository<LabResult, Long> {
  List<LabResult> findByPatient_PatientUuidOrderByLabResultDateDesc(UUID patientUuid);
  Optional<LabResult> findByLabResultUuid(UUID labResultUuid);
}
