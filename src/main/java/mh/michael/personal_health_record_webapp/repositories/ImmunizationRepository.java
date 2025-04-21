package mh.michael.personal_health_record_webapp.repositories;

import mh.michael.personal_health_record_webapp.model.Immunization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ImmunizationRepository extends JpaRepository<Immunization, Long> {
    List<Immunization> findByPatient_PatientUuidOrderByImmunizationDateDesc(UUID patientUuid);
}
