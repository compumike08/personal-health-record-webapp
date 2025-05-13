package mh.michael.personal_health_record_webapp.dto;

import java.util.List;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LabPanelDTO {

  private String labPanelUuid;
  private String labPanelName;
  private String labPanelDate;
  private List<LabResultDTO> labResultsList;
}
