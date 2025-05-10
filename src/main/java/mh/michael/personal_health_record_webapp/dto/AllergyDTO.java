package mh.michael.personal_health_record_webapp.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AllergyDTO {

  private String allergyUuid;
  private String allergyName;
  private boolean isCurrentAllergy;
  private String allergyStartedDate;
  private String allergyEndedDate;
  private String description;
}
