package mh.michael.personal_health_record_webapp.model;

import lombok.*;
import mh.michael.personal_health_record_webapp.constants.EUserRole;

import javax.persistence.*;

@Entity(name = "user_role")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private EUserRole name;
}
