package mh.michael.personal_health_record_webapp.controllers;

import java.util.List;
import mh.michael.personal_health_record_webapp.dto.AllergyDTO;
import mh.michael.personal_health_record_webapp.dto.NewAllergyRequestDTO;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.services.AllergyService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/allergies")
public class AllergyController {

  private final AllergyService allergyService;

  public AllergyController(AllergyService allergyService) {
    this.allergyService = allergyService;
  }

  @GetMapping("/patient/{patientUuid}")
  public List<AllergyDTO> getAllergiesForPatient(
    @PathVariable("patientUuid") String patientUuid,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return allergyService.getAllergiesByPatientUuid(patientUuid, jwtUserDetails);
  }

  @PostMapping("/createAllergy")
  public AllergyDTO createAllergy(
    @RequestBody NewAllergyRequestDTO newAllergyRequestDTO,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return allergyService.createAllergy(newAllergyRequestDTO, jwtUserDetails);
  }

  @PutMapping("/allergy")
  public AllergyDTO updateAllergy(
    @RequestBody AllergyDTO allergyDTO,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return allergyService.updateAllergy(allergyDTO, jwtUserDetails);
  }

  @DeleteMapping("/allergy/{allergyUuid}")
  public AllergyDTO deleteAllergy(
    @PathVariable String allergyUuid,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return allergyService.deleteAllergy(allergyUuid, jwtUserDetails);
  }
}
