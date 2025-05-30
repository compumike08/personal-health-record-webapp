package mh.michael.personal_health_record_webapp.dto;

import java.util.List;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NewLabPanelRequestDTO {

  private String labPanelName;
  private String patientUuid;
  private List<NewLabResultRequestDTO> labResultsList;
}
