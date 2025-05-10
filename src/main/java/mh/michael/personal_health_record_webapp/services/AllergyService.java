package mh.michael.personal_health_record_webapp.services;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.AllergyDTO;
import mh.michael.personal_health_record_webapp.dto.NewAllergyRequestDTO;
import mh.michael.personal_health_record_webapp.model.Allergy;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.repositories.AllergyRepository;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.util.AuthorizationUtil;
import mh.michael.personal_health_record_webapp.util.ConvertDTOUtil;
import mh.michael.personal_health_record_webapp.util.GeneralUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public class AllergyService {

  private final AllergyRepository allergyRepository;
  private final AuthorizationUtil authorizationUtil;

  public AllergyService(
    AllergyRepository allergyRepository,
    AuthorizationUtil authorizationUtil
  ) {
    this.allergyRepository = allergyRepository;
    this.authorizationUtil = authorizationUtil;
  }

  @Transactional
  public List<AllergyDTO> getAllergiesByPatientUuid(
    String patientUuidString,
    JwtUserDetails jwtUserDetails
  ) {
    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID patientUuid = UUID.fromString(patientUuidString);

    authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

    List<Allergy> allergyList =
      allergyRepository.findByPatient_PatientUuidOrderByIsCurrentAllergyDesc(patientUuid);

    return ConvertDTOUtil.convertAllergyListToAllergyDTOList(allergyList);
  }

  private void validateAllergyName(String allergyName) {
    if (allergyName == null || allergyName.isEmpty() || allergyName.length() > 300) {
      log.debug(
        "Validation Error: Allergy name is null, empty, or greater than 300 characters long"
      );
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "Allergy name is required, and must not be greater than 300 characters long"
      );
    }
  }

  @Transactional
  public AllergyDTO createAllergy(
    NewAllergyRequestDTO newAllergyRequestDTO,
    JwtUserDetails jwtUserDetails
  ) {
    if (newAllergyRequestDTO.getPatientUuid().isEmpty()) {
      log.error("Unable to create new allergy as patientUuid is empty or null");
      throw new ResponseStatusException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        INTERNAL_SERVER_ERROR_MSG
      );
    }

    validateAllergyName(newAllergyRequestDTO.getAllergyName());

    Date allergyStartedDate = GeneralUtil.parseDate(
      newAllergyRequestDTO.getAllergyStartedDate(),
      null
    );
    Date allergyEndedDate = GeneralUtil.parseDate(
      newAllergyRequestDTO.getAllergyEndedDate(),
      null
    );

    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID patientUuid = UUID.fromString(newAllergyRequestDTO.getPatientUuid());

    Patient patient = authorizationUtil.checkUserAuthorizationForPatient(
      patientUuid,
      currentUserUuid
    );

    Allergy newAllergy = Allergy.builder()
      .patient(patient)
      .allergyStartedDate(allergyStartedDate)
      .allergyEndedDate(allergyEndedDate)
      .allergyUuid(UUID.randomUUID())
      .allergyName(newAllergyRequestDTO.getAllergyName())
      .isCurrentAllergy(newAllergyRequestDTO.getIsCurrentAllergy())
      .description(newAllergyRequestDTO.getDescription())
      .build();

    Allergy savedAllergy = allergyRepository.save(newAllergy);

    return ConvertDTOUtil.convertAllergyToAllergyDTO(savedAllergy);
  }
}
