package mh.michael.personal_health_record_webapp.model;

import java.util.Date;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;

@Entity(name = "lab_result")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LabResult {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private UUID labResultUuid;

  @Column(nullable = false, length = 300)
  private String labResultName;

  @Column(nullable = false)
  private Date labResultDate;

  @Column(length = 300)
  private String labResultProviderName;

  @Column(length = 500)
  private String labResultProviderLocation;

  @Column(length = 500)
  private String labResultValue;

  @Column(length = 1000)
  private String labResultReferenceRange;

  @Column(length = 5000)
  private String labResultNotes;

  @ManyToOne
  @JoinColumn(name = "lab_panel_id")
  private LabPanel labPanel;

  @ManyToOne
  @JoinColumn(name = "patient_id")
  private Patient patient;
}
