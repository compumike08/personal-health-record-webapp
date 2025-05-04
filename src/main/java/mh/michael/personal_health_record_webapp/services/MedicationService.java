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
import mh.michael.personal_health_record_webapp.util.GeneralUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

@Service
@Slf4j
public class MedicationService {
    private final MedicationRepository medicationRepository;
    private final AuthorizationUtil authorizationUtil;

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

        validateMedNameAndDosage(
                newMedicationRequestDTO.getMedicationName(),
                newMedicationRequestDTO.getDosage(),
                newMedicationRequestDTO.getDosageUnit()
        );

        Date medicationStartDate = GeneralUtil
                .parseDate(newMedicationRequestDTO.getMedicationStartDate(), null);
        Date medicationEndDate = GeneralUtil
                .parseDate(newMedicationRequestDTO.getMedicationEndDate(), null);

        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID patientUuid = UUID.fromString(newMedicationRequestDTO.getPatientUuid());

        Patient patient = authorizationUtil.checkUserAuthorizationForPatient(patientUuid, currentUserUuid);

        Medication newMedication = Medication.builder()
                .medicationUuid(UUID.randomUUID())
                .dosage(newMedicationRequestDTO.getDosage())
                .dosageUnit(newMedicationRequestDTO.getDosageUnit())
                .medicationEndDate(medicationEndDate)
                .medicationStartDate(medicationStartDate)
                .medicationName(newMedicationRequestDTO.getMedicationName())
                .notes(newMedicationRequestDTO.getNotes())
                .isCurrentlyTaking(newMedicationRequestDTO.getIsCurrentlyTaking())
                .patient(patient)
                .build();

        Medication savedMedication = medicationRepository.save(newMedication);

        return ConvertDTOUtil.convertMedicationToMedicationDTO(savedMedication);
    }

    @Transactional
    public MedicationDTO deleteMedication(String medicationUuidString, JwtUserDetails jwtUserDetails) {
        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID medicationUuid = UUID.fromString(medicationUuidString);

        Optional<Medication> optMedication = medicationRepository.findByMedicationUuid(medicationUuid);

        if (optMedication.isEmpty()) {
            log.error("Unable to delete medication as medicationUuid {} not found", medicationUuidString);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        Medication medication = optMedication.get();
        UUID medPatientUuid = medication.getPatient().getPatientUuid();

        authorizationUtil.checkUserAuthorizationForPatient(medPatientUuid, currentUserUuid);
        medicationRepository.delete(medication);

        return ConvertDTOUtil.convertMedicationToMedicationDTO(medication);
    }

    private void validateMedNameAndDosage(String medicationName, Double dosage, String dosageUnit) {
        if (medicationName == null || medicationName.isEmpty() || medicationName.length() > 500) {
            log.debug("Validation Error: Medication name is null, empty, or greater than 500 characters long");
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Medication name is required, and must not be greater than 500 characters long"
            );
        }

        if (dosage != null && (dosageUnit == null || dosageUnit.isEmpty())) {
            log.debug("Validation Error: Medication dosageUnit is null while dosage is not null");
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "When dosage is specified, dosage unit must also be specified"
            );
        }
    }

    @Transactional
    public MedicationDTO updateMedication(MedicationDTO medicationDTO, JwtUserDetails jwtUserDetails) {
        UUID currentUserUuid = jwtUserDetails.getUserUuid();
        UUID medicationUuid = UUID.fromString(medicationDTO.getMedicationUuid());

        Optional<Medication> optMedication = medicationRepository.findByMedicationUuid(medicationUuid);

        if (optMedication.isEmpty()) {
            log.error("Unable to update medication as medicationUuid {} not found", medicationDTO.getMedicationUuid());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        Medication medication = optMedication.get();
        UUID medPatientUuid = medication.getPatient().getPatientUuid();

        authorizationUtil.checkUserAuthorizationForPatient(medPatientUuid, currentUserUuid);

        validateMedNameAndDosage(
                medicationDTO.getMedicationName(),
                medicationDTO.getDosage(),
                medicationDTO.getDosageUnit()
        );

        Date medicationStartDate = GeneralUtil
                .parseDate(medicationDTO.getMedicationStartDate(), null);
        Date medicationEndDate = GeneralUtil
                .parseDate(medicationDTO.getMedicationEndDate(), null);

        medication.setMedicationName(medicationDTO.getMedicationName());
        medication.setMedicationStartDate(medicationStartDate);
        medication.setMedicationEndDate(medicationEndDate);
        medication.setNotes(medicationDTO.getNotes());
        medication.setDosage(medicationDTO.getDosage());
        medication.setDosageUnit(medicationDTO.getDosageUnit());
        medication.setIsCurrentlyTaking(medicationDTO.getIsCurrentlyTaking());

        Medication updatedMedication = medicationRepository.save(medication);

        return ConvertDTOUtil.convertMedicationToMedicationDTO(updatedMedication);
    }
}
