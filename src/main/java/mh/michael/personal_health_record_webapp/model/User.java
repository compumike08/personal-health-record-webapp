package mh.michael.personal_health_record_webapp.model;

import java.util.*;
import javax.persistence.*;
import lombok.*;

@Entity(name = "user_record")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private UUID userUuid;

  @Column(unique = true, nullable = false)
  private String username;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String password;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    name = "user_user_roles",
    joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "role_id")
  )
  private Set<UserRole> roles = new HashSet<>();

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    name = "patient_user",
    joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "patient_id")
  )
  private List<Patient> patients = new ArrayList<>();
}
