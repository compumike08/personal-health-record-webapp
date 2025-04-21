package mh.michael.personal_health_record_webapp.services;

import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.NewPatientRequestDTO;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

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
    public List<PatientDTO> getAllPatientsOfUser(JwtUserDetails jwtUserDetails) {
        UUID userUuid = jwtUserDetails.getUserUuid();
        Optional<User> optUser = userRepository.findByUserUuid(userUuid);

        if (optUser.isEmpty()) {
            log.error("User with userUuid of {} not found", userUuid.toString());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        User user = optUser.get();

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

    @Transactional
    public PatientDTO createPatient(NewPatientRequestDTO newPatientRequest, JwtUserDetails jwtUserDetails) {
        if (newPatientRequest.getPatientName().isEmpty()) {
            log.debug("Validation Error: patientName cannot be empty");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You must enter a valid patient name");
        }

        if (newPatientRequest.getPatientName().length() > 300) {
            log.debug("Validation Error: patientName cannot exceed 300 characters");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient name cannot exceed 300 characters");
        }

        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        Optional<User> optUser = userRepository.findByUserUuid(currentUserUuid);

        if (optUser.isEmpty()) {
            log.error("User with userUuid of {} not found", currentUserUuid.toString());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        User user = optUser.get();
        List<User> paitentUsersList = new ArrayList<>();
        paitentUsersList.add(user);

        Patient newPatient = Patient.builder()
                .patientName(newPatientRequest.getPatientName())
                .patientUuid(UUID.randomUUID())
                .users(paitentUsersList)
                .build();

        Patient savedPatient = patientRepository.save(newPatient);
        return ConvertDTOUtil.convertPatientToPatientDTO(savedPatient);
    }
}
