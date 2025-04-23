package mh.michael.personal_health_record_webapp.model;

import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity(name = "medication")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private UUID medicationUuid;

    @Column(nullable = false, length = 500)
    private String medicationName;

    @Column(nullable = false)
    private Boolean isCurrentlyTaking;

    @Column
    private Date medicationStartDate;

    @Column
    private Date medicationEndDate;

    @Column
    private Double dosage;

    @Column(length = 100)
    private String dosageUnit;

    @Column(length = 5000)
    private String notes;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
