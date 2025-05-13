package mh.michael.personal_health_record_webapp.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import mh.michael.personal_health_record_webapp.model.LabPanel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabPanelRepository extends JpaRepository<LabPanel, Long> {
  List<LabPanel> findByPatient_PatientUuidOrderByLabPanelDateDesc(UUID patientUuid);
  Optional<LabPanel> findByLabPanelUuid(UUID labPanelUuid);
}
