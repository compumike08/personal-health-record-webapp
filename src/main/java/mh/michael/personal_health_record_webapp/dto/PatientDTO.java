package mh.michael.personal_health_record_webapp.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PatientDTO {
    private String patientUuid;
    private String patientName;

    private List<UserDTO> usersList;
}
