package mh.michael.personal_health_record_webapp.model;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;

@Entity(name = "lab_panel")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LabPanel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private UUID labPanelUuid;

  @Column(nullable = false, length = 300)
  private String labPanelName;

  @OneToMany(mappedBy = "labPanel", cascade = CascadeType.ALL)
  private List<LabResult> labPanelResults;

  @ManyToOne
  @JoinColumn(name = "patient_id")
  private Patient patient;
}
