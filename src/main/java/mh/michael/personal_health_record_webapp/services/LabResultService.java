package mh.michael.personal_health_record_webapp.services;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.LabResultDTO;
import mh.michael.personal_health_record_webapp.dto.NewLabResultRequestDTO;
import mh.michael.personal_health_record_webapp.model.LabResult;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.repositories.LabResultRepository;
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
public class LabResultService {

  private final LabResultRepository labResultRepository;
  private final AuthorizationUtil authorizationUtil;

  public LabResultService(
    LabResultRepository labResultRepository,
    AuthorizationUtil authorizationUtil
  ) {
    this.labResultRepository = labResultRepository;
    this.authorizationUtil = authorizationUtil;
  }

  @Transactional
  public List<LabResultDTO> getLabResultsForPatient(
    String patientUuidString,
    JwtUserDetails jwtUserDetails
  ) {
    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID patientUuid = UUID.fromString(patientUuidString);

    authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

    List<LabResult> labResultsList =
      labResultRepository.findByPatient_PatientUuidOrderByLabResultDateDesc(patientUuid);

    return ConvertDTOUtil.convertLabResultListToLabResultDTOList(labResultsList);
  }

  public static Date validateNewLabResultRequestInputs(
    NewLabResultRequestDTO newLabResultRequestDTO
  ) {
    if (newLabResultRequestDTO.getLabResultName().isEmpty()) {
      log.debug("Validation Error: labResultName is empty");
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "You must specify a lab result name"
      );
    }

    return GeneralUtil.parseDate(newLabResultRequestDTO.getLabResultDate(), null);
  }

  @Transactional
  public LabResultDTO createLabResult(
    NewLabResultRequestDTO newLabResultRequestDTO,
    JwtUserDetails jwtUserDetails
  ) {
    if (newLabResultRequestDTO.getPatientUuid().isEmpty()) {
      log.error("Unable to create new lab result as patientUuid is empty or null");
      throw new ResponseStatusException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        INTERNAL_SERVER_ERROR_MSG
      );
    }

    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID patientUuid = UUID.fromString(newLabResultRequestDTO.getPatientUuid());

    Patient patient = authorizationUtil.checkUserAuthorizationForPatient(
      patientUuid,
      currentUserUuid
    );

    Date labResultDate = validateNewLabResultRequestInputs(newLabResultRequestDTO);

    LabResult newLabResult = LabResult.builder()
      .patient(patient)
      .labResultDate(labResultDate)
      .labResultName(newLabResultRequestDTO.getLabResultName())
      .labResultNotes(newLabResultRequestDTO.getLabResultNotes())
      .labResultUuid(UUID.randomUUID())
      .labResultValue(newLabResultRequestDTO.getLabResultValue())
      .labResultProviderLocation(newLabResultRequestDTO.getLabResultProviderLocation())
      .labResultProviderName(newLabResultRequestDTO.getLabResultProviderName())
      .labResultReferenceRange(newLabResultRequestDTO.getLabResultReferenceRange())
      .build();

    LabResult savedLabResult = labResultRepository.save(newLabResult);

    return ConvertDTOUtil.convertLabResultToLabResultDTO(savedLabResult);
  }
}
