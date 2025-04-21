package mh.michael.personal_health_record_webapp.dto;

import lombok.*;
import mh.michael.personal_health_record_webapp.constants.EUserRole;

import java.util.Set;

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
