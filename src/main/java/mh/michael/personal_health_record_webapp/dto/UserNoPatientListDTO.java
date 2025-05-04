package mh.michael.personal_health_record_webapp.dto;

import java.util.Set;
import lombok.*;
import mh.michael.personal_health_record_webapp.constants.EUserRole;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserNoPatientListDTO {

  private String userUuid;
  private String username;
  private String email;
  private Set<EUserRole> roles;
}
