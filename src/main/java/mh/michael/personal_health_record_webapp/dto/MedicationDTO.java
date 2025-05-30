package mh.michael.personal_health_record_webapp.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MedicationDTO {

  private String medicationUuid;
  private String medicationName;
  private boolean isCurrentlyTaking;
  private String medicationStartDate;
  private String medicationEndDate;
  private Double dosage;
  private String dosageUnit;
  private String notes;
}
