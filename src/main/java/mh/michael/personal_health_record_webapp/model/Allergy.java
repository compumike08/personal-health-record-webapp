package mh.michael.personal_health_record_webapp.model;

import java.util.Date;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;

@Entity(name = "allergy")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Allergy {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private UUID allergyUuid;

  @Column(nullable = false, length = 500)
  private String allergyName;

  @Column(nullable = false)
  private Boolean isCurrentAllergy;

  @Column
  private Date allergyStartedDate;

  @Column
  private Date allergyEndedDate;

  @Column(length = 5000)
  private String description;

  @ManyToOne
  @JoinColumn(name = "patient_id")
  private Patient patient;
}
