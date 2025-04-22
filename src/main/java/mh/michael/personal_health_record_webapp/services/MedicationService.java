package mh.michael.personal_health_record_webapp.services;

import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.MedicationDTO;
import mh.michael.personal_health_record_webapp.dto.NewMedicationRequestDTO;
import mh.michael.personal_health_record_webapp.model.Medication;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.repositories.MedicationRepository;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.util.AuthorizationUtil;
import mh.michael.personal_health_record_webapp.util.ConvertDTOUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import static mh.michael.personal_health_record_webapp.constants.Constants.DATE_FORMAT_STRING;
import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

@Service
@Slf4j
public class MedicationService {
    private final MedicationRepository medicationRepository;
    private final AuthorizationUtil authorizationUtil;

    private final SimpleDateFormat dateFormatter = new SimpleDateFormat(DATE_FORMAT_STRING, Locale.ENGLISH);

    public MedicationService(
            MedicationRepository medicationRepository,
            AuthorizationUtil authorizationUtil
    ) {
        this.medicationRepository = medicationRepository;
        this.authorizationUtil = authorizationUtil;
    }

    @Transactional
    public List<MedicationDTO> getMedicationsByPatientUuid(String patientUuidString, JwtUserDetails jwtUserDetails) {
        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID patientUuid = UUID.fromString(patientUuidString);

        authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

        List<Medication> medicationList = medicationRepository
                .findByPatient_PatientUuidOrderByIsCurrentlyTakingDesc(patientUuid);

        return ConvertDTOUtil.convertMedicationListToMedicationDTOList(medicationList);
    }

    @Transactional
    public MedicationDTO createMedication(
            NewMedicationRequestDTO newMedicationRequestDTO,
            JwtUserDetails jwtUserDetails
    ) {
        if (newMedicationRequestDTO.getPatientUuid().isEmpty()) {
            log.error("Unable to create new immunization as patientUuid is empty or null");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        String medicationName = newMedicationRequestDTO.getMedicationName();

        if (medicationName == null || medicationName.isEmpty() || medicationName.length() > 500) {
            log.debug("Validation Error: Medication name is null, empty, or greater than 500 characters long");
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Medication name is required, and must not be greater than 500 characters long"
            );
        }

        Date medicationStartDate = null;
        if (newMedicationRequestDTO.getMedicationStartDate() != null &&
                !newMedicationRequestDTO.getMedicationStartDate().isEmpty()
        ) {
            try {
                medicationStartDate = dateFormatter.parse(newMedicationRequestDTO.getMedicationStartDate());
            } catch (ParseException e) {
                log.error("Unable to parse medicationStartDate {}", newMedicationRequestDTO.getMedicationStartDate());
                log.error(e.getMessage(), e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
            }
        }

        Date medicationEndDate = null;
        if (newMedicationRequestDTO.getMedicationEndDate() != null &&
                !newMedicationRequestDTO.getMedicationEndDate().isEmpty()
        ) {
            try {
                medicationEndDate = dateFormatter.parse(newMedicationRequestDTO.getMedicationEndDate());
            } catch (ParseException e) {
                log.error("Unable to parse medicationEndDate {}", newMedicationRequestDTO.getMedicationEndDate());
                log.error(e.getMessage(), e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
            }
        }

        if (newMedicationRequestDTO.getDosage() != null &&
                (newMedicationRequestDTO.getDosageUnit() == null ||
                        newMedicationRequestDTO.getDosageUnit().isEmpty()
                )
        ) {
            log.debug("Validation Error: Medication dosageUnit is null while dosage is not null");
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "When dosage is specified, dosage unit must also be specified"
            );
        }

        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID patientUuid = UUID.fromString(newMedicationRequestDTO.getPatientUuid());

        Patient patient = authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

        Medication newMedication = Medication.builder()
                .dosage(newMedicationRequestDTO.getDosage())
                .dosageUnit(newMedicationRequestDTO.getDosageUnit())
                .medicationEndDate(medicationEndDate)
                .medicationStartDate(medicationStartDate)
                .medicationName(medicationName)
                .notes(newMedicationRequestDTO.getNotes())
                .isCurrentlyTaking(newMedicationRequestDTO.getIsCurrentlyTaking())
                .patient(patient)
                .build();

        Medication savedMedication = medicationRepository.save(newMedication);

        return ConvertDTOUtil.convertMedicationToMedicationDTO(savedMedication);
    }
}
