package mh.michael.personal_health_record_webapp.util;

import mh.michael.personal_health_record_webapp.dto.*;
import mh.michael.personal_health_record_webapp.model.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static mh.michael.personal_health_record_webapp.constants.Constants.DATE_FORMAT_STRING;

public class ConvertDTOUtil {
    private static final SimpleDateFormat dateFormatter = new SimpleDateFormat(DATE_FORMAT_STRING, Locale.US);

    private ConvertDTOUtil() {}

    public static UserDTO convertUserToUserDTO(User user) {
        return UserDTO.builder()
                .email(user.getEmail())
                .roles(user.getRoles().parallelStream().map(UserRole::getName).collect(Collectors.toSet()))
                .username(user.getUsername())
                .userUuid(user.getUserUuid().toString())
                .patientList(convertPatientListToPatientDTOList(user.getPatients()))
                .build();
    }

    public static UserNoPatientListDTO convertUserToUserNoPatientListDTO(User user) {
        return UserNoPatientListDTO.builder()
                .email(user.getEmail())
                .roles(user.getRoles().parallelStream().map(UserRole::getName).collect(Collectors.toSet()))
                .username(user.getUsername())
                .userUuid(user.getUserUuid().toString())
                .build();
    }

    public static List<UserNoPatientListDTO> convertUserListToUserNoPatientListDTOList(List<User> userList) {
        return userList.parallelStream()
                .map(ConvertDTOUtil::convertUserToUserNoPatientListDTO).collect(Collectors.toList());
    }

    public static List<UserDTO> convertUserListToUserDTOList(List<User> userList) {
        return userList.parallelStream().map(ConvertDTOUtil::convertUserToUserDTO).collect(Collectors.toList());
    }

    public static PatientDTO convertPatientToPatientDTO(Patient patient) {
        return PatientDTO.builder()
                .patientUuid(patient.getPatientUuid().toString())
                .patientName(patient.getPatientName())
                .usersList(convertUserListToUserNoPatientListDTOList(patient.getUsers()))
                .build();
    }

    public static List<PatientDTO> convertPatientListToPatientDTOList(List<Patient> patientList) {
        return patientList.parallelStream().map(ConvertDTOUtil::convertPatientToPatientDTO).collect(Collectors.toList());
    }

    public static ImmunizationDTO convertImmunizationToImmunizationDTO(Immunization immunization) {
        return ImmunizationDTO.builder()
                .id(immunization.getId())
                .description(immunization.getDescription())
                .immunizationDate(dateFormatter.format(immunization.getImmunizationDate()))
                .immunizationName(immunization.getImmunizationName())
                .providerName(immunization.getProviderName())
                .providerLocation(immunization.getProviderLocation())
                .build();
    }

    public static List<ImmunizationDTO> convertImmunizationListToImmunizationDTOList(List<Immunization> immunizationList) {
        return immunizationList.stream()
                .map(ConvertDTOUtil::convertImmunizationToImmunizationDTO).collect(Collectors.toList());
    }

    public static MedicationDTO convertMedicationToMedicationDTO(Medication medication) {
        return MedicationDTO.builder()
                .id(medication.getId())
                .dosage(medication.getDosage())
                .dosageUnit(medication.getDosageUnit())
                .isCurrentlyTaking(medication.getIsCurrentlyTaking())
                .medicationStartDate(medication.getMedicationStartDate() == null ?
                        "" : dateFormatter.format(medication.getMedicationStartDate()))
                .medicationEndDate(medication.getMedicationEndDate() == null ?
                        "" : dateFormatter.format(medication.getMedicationEndDate()))
                .medicationName(medication.getMedicationName())
                .notes(medication.getNotes())
                .build();
    }

    public static List<MedicationDTO> convertMedicationListToMedicationDTOList(List<Medication> medicationList) {
        return medicationList.stream()
                .map(ConvertDTOUtil::convertMedicationToMedicationDTO).collect(Collectors.toList());
    }
}
