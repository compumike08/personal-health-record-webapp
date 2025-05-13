package mh.michael.personal_health_record_webapp.services;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.LabPanelDTO;
import mh.michael.personal_health_record_webapp.dto.NewLabPanelRequestDTO;
import mh.michael.personal_health_record_webapp.model.LabPanel;
import mh.michael.personal_health_record_webapp.model.LabResult;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.repositories.LabPanelRepository;
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
public class LabPanelService {

  private final LabPanelRepository labPanelRepository;
  private final LabResultRepository labResultRepository;
  private final AuthorizationUtil authorizationUtil;

  public LabPanelService(
    LabPanelRepository labPanelRepository,
    LabResultRepository labResultRepository,
    AuthorizationUtil authorizationUtil
  ) {
    this.labPanelRepository = labPanelRepository;
    this.labResultRepository = labResultRepository;
    this.authorizationUtil = authorizationUtil;
  }

  @Transactional
  public List<LabPanelDTO> getLabPanelsForPatient(
    String patientUuidString,
    JwtUserDetails jwtUserDetails
  ) {
    UUID currentUserUuid = jwtUserDetails.getUserUuid();
    UUID patientUuid = UUID.fromString(patientUuidString);

    authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

    List<LabPanel> labPanelList =
      labPanelRepository.findByPatient_PatientUuidOrderByLabPanelDateDesc(patientUuid);

    return ConvertDTOUtil.convertLabPanelListToLabPanelDTOList(labPanelList);
  }

  private Date validateLabPanelInputs(NewLabPanelRequestDTO newLabPanelRequestDTO) {
    if (newLabPanelRequestDTO.getLabPanelName().isEmpty()) {
      log.debug("Validation Error: labPanelName is empty");
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "You must specify a lab panel name"
      );
    }

    return GeneralUtil.parseDate(newLabPanelRequestDTO.getLabPanelDate(), null);
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

    Date labPanelDate = validateLabPanelInputs(newLabPanelRequestDTO);

    LabPanel newLabPanel = LabPanel.builder()
      .labPanelUuid(UUID.randomUUID())
      .labPanelName(newLabPanelRequestDTO.getLabPanelName())
      .labPanelDate(labPanelDate)
      .labPanelResults(new ArrayList<>())
      .patient(patient)
      .build();

    LabPanel savedLabPanel = labPanelRepository.save(newLabPanel);

    List<LabResult> newLabResultList = new ArrayList<>();

    newLabPanelRequestDTO
      .getLabResultsList()
      .forEach(labResultRequestDTO -> {
        Date labResultDate = LabResultService.validateNewLabResultRequestInputs(
          labResultRequestDTO
        );
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
          .labPanel(savedLabPanel)
          .build();

        newLabResultList.add(newLabResult);
      });

    List<LabResult> savedLabResultsList = labResultRepository.saveAll(newLabResultList);

    savedLabPanel.setLabPanelResults(savedLabResultsList);

    return ConvertDTOUtil.convertLabPanelToLabPanelDTO(savedLabPanel);
  }
}
