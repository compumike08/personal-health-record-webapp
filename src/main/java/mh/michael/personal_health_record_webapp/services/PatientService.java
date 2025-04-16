package mh.michael.personal_health_record_webapp.services;

import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.PatientDTO;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.model.User;
import mh.michael.personal_health_record_webapp.repositories.PatientRepository;
import mh.michael.personal_health_record_webapp.repositories.UserRepository;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.util.ConvertDTOUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class PatientService {
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<PatientDTO> getAllPatientsOfUser(String userUuid, JwtUserDetails jwtUserDetails) {
        Optional<User> optUser = userRepository.findByUserUuid(UUID.fromString(userUuid));

        if (optUser.isEmpty()) {
            log.error("User with userUuid of {} not found", userUuid);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        User user = optUser.get();

        if (!userUuid.equals(jwtUserDetails.getUserUuid().toString())) {
            log.error("Current user requested patients of a different user with userUuid of {}", userUuid);
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Current user not authorized to access requested user"
            );
        }

        return ConvertDTOUtil.convertPatientListToPatientDTOList(user.getPatients());
    }

    @Transactional
    public PatientDTO getPatientByPatientUuid(String patientUuid, JwtUserDetails jwtUserDetails) {
        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        Optional<Patient> optPatient = patientRepository.findByPatientUuid(UUID.fromString(patientUuid));

        if (optPatient.isEmpty()) {
            log.error("Patient with patientUuid of {} not found", patientUuid);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        Patient patient = optPatient.get();

        if (!patient.isPatientLinkedWithUserUuid(currentUserUuid)) {
            log.error("Patient with patientUuid of {} is not linked to current user", patientUuid);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        return ConvertDTOUtil.convertPatientToPatientDTO(patient);
    }
}
