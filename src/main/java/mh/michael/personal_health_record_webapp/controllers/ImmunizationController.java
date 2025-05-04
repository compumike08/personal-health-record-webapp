package mh.michael.personal_health_record_webapp.controllers;

import mh.michael.personal_health_record_webapp.dto.ImmunizationDTO;
import mh.michael.personal_health_record_webapp.dto.NewImmunizationRequestDTO;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.services.ImmunizationService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/immunizations")
public class ImmunizationController {
    private final ImmunizationService immunizationService;

    public ImmunizationController(ImmunizationService immunizationService) {
        this.immunizationService = immunizationService;
    }

    @GetMapping("/patient/{patientUuid}")
    public List<ImmunizationDTO> getImmunizationsForPatient(
            @PathVariable String patientUuid,
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails
    ) {
        return immunizationService.getImmunizationsByPatientUuid(patientUuid, jwtUserDetails);
    }

    @PostMapping("/createImmunization")
    public ImmunizationDTO createImmunization(
            @RequestBody NewImmunizationRequestDTO newImmunizationRequestDTO,
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails
    ) {
        return immunizationService.createImmunization(newImmunizationRequestDTO, jwtUserDetails);
    }

    @DeleteMapping("/immunization/{immunizationUuid}")
    public ImmunizationDTO deleteImmunization(
            @PathVariable String immunizationUuid,
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails
    ) {
        return immunizationService.deleteImmunization(immunizationUuid, jwtUserDetails);
    }

}
