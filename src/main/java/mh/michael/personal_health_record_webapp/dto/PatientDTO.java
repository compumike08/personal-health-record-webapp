package mh.michael.personal_health_record_webapp.dto;

import java.util.List;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PatientDTO {

  private String patientUuid;
  private String patientName;

  private List<UserNoPatientListDTO> usersList;
}
