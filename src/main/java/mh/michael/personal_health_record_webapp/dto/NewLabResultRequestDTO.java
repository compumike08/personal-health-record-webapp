package mh.michael.personal_health_record_webapp.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NewLabResultRequestDTO {

  private String labResultName;
  private String labResultDate;
  private String labResultProviderName;
  private String labResultProviderLocation;
  private String labResultValue;
  private String labResultReferenceRange;
  private String labResultNotes;
  private String patientUuid;
}
