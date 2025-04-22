package mh.michael.personal_health_record_webapp.controllers;

import mh.michael.personal_health_record_webapp.dto.MedicationDTO;
import mh.michael.personal_health_record_webapp.dto.NewMedicationRequestDTO;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.services.MedicationService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medications")
public class MedicationController {
    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping("/patient/{patientUuid}")
    public List<MedicationDTO> getMedicationsForPatient(
            @PathVariable String patientUuid,
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails
    ) {
        return medicationService.getMedicationsByPatientUuid(patientUuid, jwtUserDetails);
    }

    @PostMapping("/createMedication")
    public MedicationDTO createMedication(
            @RequestBody NewMedicationRequestDTO newMedicationRequestDTO,
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails
    ) {
        return medicationService.createMedication(newMedicationRequestDTO, jwtUserDetails);
    }
}
