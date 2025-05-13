package mh.michael.personal_health_record_webapp.model;

import java.util.List;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;

@Entity(name = "patient")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Patient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private UUID patientUuid;

  @Column(nullable = false, length = 300)
  private String patientName;

  @ManyToMany
  @JoinTable(
    name = "patient_user",
    joinColumns = @JoinColumn(name = "patient_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id")
  )
  private List<User> users;

  @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
  private List<Immunization> immunizations;

  @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
  private List<Medication> medications;

  @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
  private List<Allergy> allergies;

  @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
  private List<LabResult> labResults;

  @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
  private List<LabPanel> labPanels;

  public boolean isPatientLinkedWithUserUuid(UUID userUuid) {
    return getUsers()
      .parallelStream()
      .anyMatch(user -> user.getUserUuid().equals(userUuid));
  }
}
