package mh.michael.personal_health_record_webapp.controllers;

import java.util.List;
import mh.michael.personal_health_record_webapp.dto.LabResultDTO;
import mh.michael.personal_health_record_webapp.dto.NewLabResultRequestDTO;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.services.LabResultService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/labResults")
public class LabResultController {

  private final LabResultService labResultService;

  public LabResultController(LabResultService labResultService) {
    this.labResultService = labResultService;
  }

  @GetMapping("/patient/{patientUuid}")
  public List<LabResultDTO> getLabResultsByPatientUuid(
    @PathVariable("patientUuid") String patientUuid,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return labResultService.getLabResultsForPatient(patientUuid, jwtUserDetails);
  }

  @PostMapping("/createLabResult")
  public LabResultDTO createLabResult(
    @RequestBody NewLabResultRequestDTO newLabResultRequestDTO,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return labResultService.createLabResult(newLabResultRequestDTO, jwtUserDetails);
  }

  @PutMapping("/labResult")
  public LabResultDTO updateLabResult(
    @RequestBody LabResultDTO labResultDTO,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return labResultService.updateLabResultTransactional(labResultDTO, jwtUserDetails);
  }

  @DeleteMapping("/labResult/{labResultUuid}")
  public LabResultDTO deleteLabResult(
    @PathVariable("labResultUuid") String labResultUuid,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return labResultService.deleteLabResult(labResultUuid, jwtUserDetails);
  }
}
