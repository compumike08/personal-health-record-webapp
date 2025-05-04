package mh.michael.personal_health_record_webapp.util;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.model.User;
import mh.michael.personal_health_record_webapp.repositories.PatientRepository;
import mh.michael.personal_health_record_webapp.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
@Slf4j
public class AuthorizationUtil {

  private final PatientRepository patientRepository;
  private final UserRepository userRepository;

  public AuthorizationUtil(
    PatientRepository patientRepository,
    UserRepository userRepository
  ) {
    this.patientRepository = patientRepository;
    this.userRepository = userRepository;
  }

  public User getUserByUserUuid(UUID userUuid) {
    Optional<User> optUser = userRepository.findByUserUuid(userUuid);

    if (optUser.isEmpty()) {
      log.error("User with userUuid of {} not found", userUuid.toString());
      throw new ResponseStatusException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        INTERNAL_SERVER_ERROR_MSG
      );
    }

    return optUser.get();
  }

  public Patient checkUserAuthorizationForPatient(
    UUID patientUuid,
    UUID currentUserUuid
  ) {
    Optional<Patient> optPatient = patientRepository.findByPatientUuid(patientUuid);

    if (optPatient.isEmpty()) {
      log.error("Patient with patientUuid of {} not found", patientUuid);
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
    }

    Patient patient = optPatient.get();

    if (!patient.isPatientLinkedWithUserUuid(currentUserUuid)) {
      log.error(
        "Patient with patientUuid of {} is not linked to current user",
        patientUuid
      );
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
    }

    return patient;
  }
}
