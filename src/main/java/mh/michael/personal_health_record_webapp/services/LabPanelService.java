package mh.michael.personal_health_record_webapp.services;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

import java.util.*;
import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.LabPanelDTO;
import mh.michael.personal_health_record_webapp.dto.NewLabPanelRequestDTO;
import mh.michael.personal_health_record_webapp.model.LabPanel;
import mh.michael.personal_health_record_webapp.model.LabResult;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.repositories.LabPanelRepository;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.util.AuthorizationUtil;
import mh.michael.personal_health_record_webapp.util.ConvertDTOUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public class LabPanelService {

  private final LabPanelRepository labPanelRepository;
  private final AuthorizationUtil authorizationUtil;
  private final LabResultService labResultService;

  public LabPanelService(
    LabPanelRepository labPanelRepository,
    AuthorizationUtil authorizationUtil,
    LabResultService labResultService
  ) {
    this.labPanelRepository = labPanelRepository;
    this.authorizationUtil = authorizationUtil;
    this.labResultService = labResultService;
  }

  @Transactional
  public List<LabPanelDTO> getLabPanelsForPatient(
    String patientUuidString,
    JwtUserDetails jwtUserDetails
  ) {
    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID patientUuid = UUID.fromString(patientUuidString);

    authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

    List<LabPanel> labPanelList = labPanelRepository.findByPatient_PatientUuid(
      patientUuid
    );

    return ConvertDTOUtil.convertLabPanelListToLabPanelDTOList(labPanelList);
  }

  private <T> void validateLabPanelInputs(String labPanelName, List<T> labResultsList) {
    if (labPanelName.isEmpty()) {
      log.debug("Validation Error: labPanelName is empty");
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "You must specify a lab panel name"
      );
    }

    if (labResultsList == null || labResultsList.isEmpty()) {
      log.debug("Validation Error: labResultsList is empty");
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "You must add at least one lab result to the lab panel"
      );
    }
  }

  @Transactional
  public LabPanelDTO updateLabPanel(
    LabPanelDTO labPanelDTO,
    JwtUserDetails jwtUserDetails
  ) {
    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID labPanelUuid = UUID.fromString(labPanelDTO.getLabPanelUuid());

    Optional<LabPanel> labPanelOptional = labPanelRepository.findByLabPanelUuid(
      labPanelUuid
    );

    if (labPanelOptional.isEmpty()) {
      log.error(
        "Unable to update lab panel as labPanelUuid {} was not found",
        labPanelUuid
      );
      throw new ResponseStatusException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        INTERNAL_SERVER_ERROR_MSG
      );
    }

    LabPanel labPanel = labPanelOptional.get();
    UUID patientUuid = labPanel.getPatient().getPatientUuid();

    authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

    validateLabPanelInputs(
      labPanelDTO.getLabPanelName(),
      labPanelDTO.getLabResultsList()
    );

    labPanel.setLabPanelName(labPanelDTO.getLabPanelName());

    labPanelDTO
      .getLabResultsList()
      .forEach(labResultDTO -> {
        labResultService.updateLabResult(labResultDTO, jwtUserDetails);
      });

    LabPanel updatedLabPanel = labPanelRepository.save(labPanel);

    return ConvertDTOUtil.convertLabPanelToLabPanelDTO(updatedLabPanel);
  }

  @Transactional
  public LabPanelDTO createLabPanel(
    NewLabPanelRequestDTO newLabPanelRequestDTO,
    JwtUserDetails jwtUserDetails
  ) {
    if (newLabPanelRequestDTO.getPatientUuid().isEmpty()) {
      log.error("Unable to create new lab panel as patientUuid is empty or null");
      throw new ResponseStatusException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        INTERNAL_SERVER_ERROR_MSG
      );
    }

    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID patientUuid = UUID.fromString(newLabPanelRequestDTO.getPatientUuid());

    Patient patient = authorizationUtil.checkUserAuthorizationForPatient(
      patientUuid,
      currentUserUuid
    );

    // Security measure to ensure all new lab results use authorized patient id
    newLabPanelRequestDTO
      .getLabResultsList()
      .forEach(labResultRequestDTO -> {
        labResultRequestDTO.setPatientUuid(patient.getPatientUuid().toString());
      });

    validateLabPanelInputs(
      newLabPanelRequestDTO.getLabPanelName(),
      newLabPanelRequestDTO.getLabResultsList()
    );

    LabPanel newLabPanel = LabPanel.builder()
      .labPanelUuid(UUID.randomUUID())
      .labPanelName(newLabPanelRequestDTO.getLabPanelName())
      .labPanelResults(new ArrayList<>())
      .patient(patient)
      .build();

    List<LabResult> newLabResultList = new ArrayList<>();

    newLabPanelRequestDTO
      .getLabResultsList()
      .forEach(labResultRequestDTO -> {
        Date labResultDate = LabResultService.validateNewLabResultRequestInputs(
          labResultRequestDTO.getLabResultName(),
          labResultRequestDTO.getLabResultDate()
        );

        if (labResultDate == null) {
          log.error("Validation Error: labResultDate is empty");
          throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "You must enter a Lab Panel Date"
          );
        }

        LabResult newLabResult = LabResult.builder()
          .labResultReferenceRange(labResultRequestDTO.getLabResultReferenceRange())
          .labResultName(labResultRequestDTO.getLabResultName())
          .labResultValue(labResultRequestDTO.getLabResultValue())
          .labResultProviderName(labResultRequestDTO.getLabResultProviderName())
          .labResultProviderLocation(labResultRequestDTO.getLabResultProviderLocation())
          .labResultUuid(UUID.randomUUID())
          .labResultNotes(labResultRequestDTO.getLabResultNotes())
          .labResultDate(labResultDate)
          .patient(patient)
          .labPanel(newLabPanel)
          .build();

        newLabResultList.add(newLabResult);
      });

    newLabPanel.setLabPanelResults(newLabResultList);

    LabPanel savedLabPanel = labPanelRepository.save(newLabPanel);

    return ConvertDTOUtil.convertLabPanelToLabPanelDTO(savedLabPanel);
  }

  @Transactional
  public LabPanelDTO deleteLabPanel(
    String labPanelUuidString,
    JwtUserDetails jwtUserDetails
  ) {
    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID labPanelUuid = UUID.fromString(labPanelUuidString);

    Optional<LabPanel> labPanelOptional = labPanelRepository.findByLabPanelUuid(
      labPanelUuid
    );

    if (labPanelOptional.isEmpty()) {
      log.error(
        "Unable to update lab panel as labPanelUuid {} was not found",
        labPanelUuid
      );
      throw new ResponseStatusException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        INTERNAL_SERVER_ERROR_MSG
      );
    }

    LabPanel labPanel = labPanelOptional.get();
    UUID patientUuid = labPanel.getPatient().getPatientUuid();

    authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

    labPanel
      .getLabPanelResults()
      .forEach(labResult -> {
        labResultService.deleteLabResult(
          labResult.getLabResultUuid().toString(),
          jwtUserDetails
        );
      });

    labPanelRepository.delete(labPanel);

    return ConvertDTOUtil.convertLabPanelToLabPanelDTO(labPanel);
  }
}
