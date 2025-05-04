package mh.michael.personal_health_record_webapp.model;

import java.util.Date;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;

@Entity(name = "immunization")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Immunization {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private UUID immunizationUuid;

  @Column(nullable = false)
  private Date immunizationDate;

  @Column(nullable = false, length = 300)
  private String immunizationName;

  @Column(length = 300)
  private String providerName;

  @Column(length = 500)
  private String providerLocation;

  @Column(length = 5000)
  private String description;

  @ManyToOne
  @JoinColumn(name = "patient_id")
  private Patient patient;
}
