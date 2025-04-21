package mh.michael.personal_health_record_webapp.dto;

import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NewImmunizationRequestDTO {
    private String immunizationDate;
    private String immunizationName;
    private String providerName;
    private String providerLocation;
    private String description;
    private String patientUuid;
}
