package mh.michael.personal_health_record_webapp.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PatientNoUsersDTO {
    private String patientUuid;
    private String patientName;
}
