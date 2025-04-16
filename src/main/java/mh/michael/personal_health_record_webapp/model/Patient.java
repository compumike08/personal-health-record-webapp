package mh.michael.personal_health_record_webapp.model;

import lombok.*;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

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

    @Column(nullable = false)
    private String patientName;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "patient_user",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "patient_id"))
    private List<User> users;
}
