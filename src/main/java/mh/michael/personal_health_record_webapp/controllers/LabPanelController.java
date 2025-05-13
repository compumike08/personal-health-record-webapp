package mh.michael.personal_health_record_webapp.controllers;

import java.util.List;
import mh.michael.personal_health_record_webapp.dto.LabPanelDTO;
import mh.michael.personal_health_record_webapp.dto.NewLabPanelRequestDTO;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.services.LabPanelService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/labPanels")
public class LabPanelController {

  private final LabPanelService labPanelService;

  public LabPanelController(LabPanelService labPanelService) {
    this.labPanelService = labPanelService;
  }

  @GetMapping("/patient/{patientUuid}")
  public List<LabPanelDTO> getLabPanelsForPatient(
    @PathVariable("patientUuid") String patientUuid,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return labPanelService.getLabPanelsForPatient(patientUuid, jwtUserDetails);
  }

  @PostMapping("/createLabPanel")
  public LabPanelDTO createLabPanel(
    @RequestBody NewLabPanelRequestDTO newLabPanelRequestDTO,
    @AuthenticationPrincipal JwtUserDetails jwtUserDetails
  ) {
    return labPanelService.createLabPanel(newLabPanelRequestDTO, jwtUserDetails);
  }
}
