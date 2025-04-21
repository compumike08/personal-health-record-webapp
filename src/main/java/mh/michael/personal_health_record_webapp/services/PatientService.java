package mh.michael.personal_health_record_webapp.services;

import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.NewPatientRequestDTO;
import mh.michael.personal_health_record_webapp.dto.PatientDTO;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.model.User;
import mh.michael.personal_health_record_webapp.repositories.PatientRepository;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.util.AuthorizationUtil;
import mh.michael.personal_health_record_webapp.util.ConvertDTOUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class PatientService {
    private final PatientRepository patientRepository;
    private final AuthorizationUtil authorizationUtil;

    public PatientService(
            PatientRepository patientRepository,
            AuthorizationUtil authorizationUtil
    ) {
        this.patientRepository = patientRepository;
        this.authorizationUtil = authorizationUtil;
    }

    @Transactional
    public List<PatientDTO> getAllPatientsOfUser(JwtUserDetails jwtUserDetails) {
        UUID userUuid = jwtUserDetails.getUserUuid();
        User user = authorizationUtil.getUserByUserUuid(userUuid);

        return ConvertDTOUtil.convertPatientListToPatientDTOList(user.getPatients());
    }

    @Transactional
    public PatientDTO getPatientByPatientUuid(String patientUuidString, JwtUserDetails jwtUserDetails) {
        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID patientUuid = UUID.fromString(patientUuidString);

        Patient patient = authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

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
        User user = authorizationUtil.getUserByUserUuid(currentUserUuid);

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
