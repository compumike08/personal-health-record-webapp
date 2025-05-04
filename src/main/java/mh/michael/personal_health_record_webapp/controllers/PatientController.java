package mh.michael.personal_health_record_webapp.controllers;

import java.util.List;
import mh.michael.personal_health_record_webapp.dto.NewPatientRequestDTO;
import mh.michael.personal_health_record_webapp.dto.PatientDTO;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.services.PatientService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

  private final PatientService patientService;

  public PatientController(PatientService patientService) {
    this.patientService = patientService;
  }

  @GetMapping("/currentUsersPatients")
  public List<PatientDTO> getCurrentUsersPatients(
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return patientService.getAllPatientsOfUser(jwtUserDetails);
  }

  @GetMapping("/patient/{patientUuid}")
  public PatientDTO getPatient(
    @PathVariable("patientUuid") String patientUuid,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return patientService.getPatientByPatientUuid(patientUuid, jwtUserDetails);
  }

  @PostMapping("/createPatient")
  public PatientDTO createPatient(
    @RequestBody NewPatientRequestDTO newPatientRequestDTO,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return patientService.createPatient(newPatientRequestDTO, jwtUserDetails);
  }
}
