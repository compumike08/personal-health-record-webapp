package mh.michael.personal_health_record_webapp.services;

import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.ImmunizationDTO;
import mh.michael.personal_health_record_webapp.dto.NewImmunizationRequestDTO;
import mh.michael.personal_health_record_webapp.model.Immunization;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.repositories.ImmunizationRepository;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.util.AuthorizationUtil;
import mh.michael.personal_health_record_webapp.util.ConvertDTOUtil;
import mh.michael.personal_health_record_webapp.util.GeneralUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

@Service
@Slf4j
public class ImmunizationService {
    private final ImmunizationRepository immunizationRepository;
    private final AuthorizationUtil authorizationUtil;

    public ImmunizationService(
            ImmunizationRepository immunizationRepository,
            AuthorizationUtil authorizationUtil
    ) {
        this.immunizationRepository = immunizationRepository;
        this.authorizationUtil = authorizationUtil;
    }

    @Transactional
    public List<ImmunizationDTO> getImmunizationsByPatientUuid(String patientUuidString, JwtUserDetails jwtUserDetails) {
        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID patientUuid = UUID.fromString(patientUuidString);

        authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

        List<Immunization> immunizationList = immunizationRepository
                .findByPatient_PatientUuidOrderByImmunizationDateDesc(patientUuid);

        return ConvertDTOUtil.convertImmunizationListToImmunizationDTOList(immunizationList);
    }

    private Date validateImmunizationInputs(
            String immunizationDateString,
            String immunizationName
    ) {
        if (immunizationName.isEmpty()) {
            log.debug("Validation Error: immunizationName is empty");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You must specify a immunization name");
        }

        if (immunizationDateString.isEmpty()) {
            log.debug("Validation Error: immunizationDate is empty");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You must specify an immunization date");
        }

        return GeneralUtil.parseDate(immunizationDateString, null);
    }

    @Transactional
    public ImmunizationDTO createImmunization(
            NewImmunizationRequestDTO newImmunizationRequestDTO,
            JwtUserDetails jwtUserDetails
    ) {
        if (newImmunizationRequestDTO.getPatientUuid().isEmpty()) {
            log.error("Unable to create new immunization as patientUuid is empty or null");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID patientUuid = UUID.fromString(newImmunizationRequestDTO.getPatientUuid());

        Patient patient = authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

        Date immunizationDate = validateImmunizationInputs(
                newImmunizationRequestDTO.getImmunizationDate(),
                newImmunizationRequestDTO.getImmunizationName()
        );

        Immunization newImmunization = Immunization.builder()
                .immunizationUuid(UUID.randomUUID())
                .patient(patient)
                .immunizationDate(immunizationDate)
                .immunizationName(newImmunizationRequestDTO.getImmunizationName())
                .description(newImmunizationRequestDTO.getDescription())
                .providerName(newImmunizationRequestDTO.getProviderName())
                .providerLocation(newImmunizationRequestDTO.getProviderLocation())
                .build();

        Immunization savedImmunization = immunizationRepository.save(newImmunization);

        return ConvertDTOUtil.convertImmunizationToImmunizationDTO(savedImmunization);
    }

    @Transactional
    public ImmunizationDTO deleteImmunization(String immunizationUuidString, JwtUserDetails jwtUserDetails) {
        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID immunizationUuid = UUID.fromString(immunizationUuidString);

        Optional<Immunization> optImmunization = immunizationRepository.findByImmunizationUuid(immunizationUuid);

        if (optImmunization.isEmpty()) {
            log.error("Unable to delete immunization as immunizationUuid {} not found", immunizationUuidString);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        Immunization immunization = optImmunization.get();
        UUID patientUuid = immunization.getPatient().getPatientUuid();

        authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);
        immunizationRepository.delete(immunization);

        return ConvertDTOUtil.convertImmunizationToImmunizationDTO(immunization);
    }
}
