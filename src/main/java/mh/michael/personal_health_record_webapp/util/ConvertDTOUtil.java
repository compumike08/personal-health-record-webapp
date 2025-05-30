package mh.michael.personal_health_record_webapp.util;

import static mh.michael.personal_health_record_webapp.constants.Constants.DATE_FORMAT_STRING;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import mh.michael.personal_health_record_webapp.dto.*;
import mh.michael.personal_health_record_webapp.model.*;

public class ConvertDTOUtil {

  private static final SimpleDateFormat dateFormatter = new SimpleDateFormat(
    DATE_FORMAT_STRING,
    Locale.US
  );

  private ConvertDTOUtil() {}

  public static UserDTO convertUserToUserDTO(User user) {
    return UserDTO.builder()
      .email(user.getEmail())
      .roles(
        user
          .getRoles()
          .parallelStream()
          .map(UserRole::getName)
          .collect(Collectors.toSet())
      )
      .username(user.getUsername())
      .userUuid(user.getUserUuid().toString())
      .patientList(convertPatientListToPatientDTOList(user.getPatients()))
      .build();
  }

  public static UserNoPatientListDTO convertUserToUserNoPatientListDTO(User user) {
    return UserNoPatientListDTO.builder()
      .email(user.getEmail())
      .roles(
        user
          .getRoles()
          .parallelStream()
          .map(UserRole::getName)
          .collect(Collectors.toSet())
      )
      .username(user.getUsername())
      .userUuid(user.getUserUuid().toString())
      .build();
  }

  public static List<UserNoPatientListDTO> convertUserListToUserNoPatientListDTOList(
    List<User> userList
  ) {
    return userList
      .parallelStream()
      .map(ConvertDTOUtil::convertUserToUserNoPatientListDTO)
      .collect(Collectors.toList());
  }

  public static List<UserDTO> convertUserListToUserDTOList(List<User> userList) {
    return userList
      .parallelStream()
      .map(ConvertDTOUtil::convertUserToUserDTO)
      .collect(Collectors.toList());
  }

  public static PatientDTO convertPatientToPatientDTO(Patient patient) {
    return PatientDTO.builder()
      .patientUuid(patient.getPatientUuid().toString())
      .patientName(patient.getPatientName())
      .usersList(convertUserListToUserNoPatientListDTOList(patient.getUsers()))
      .build();
  }

  public static List<PatientDTO> convertPatientListToPatientDTOList(
    List<Patient> patientList
  ) {
    return patientList
      .parallelStream()
      .map(ConvertDTOUtil::convertPatientToPatientDTO)
      .collect(Collectors.toList());
  }

  public static ImmunizationDTO convertImmunizationToImmunizationDTO(
    Immunization immunization
  ) {
    return ImmunizationDTO.builder()
      .immunizationUuid(immunization.getImmunizationUuid().toString())
      .description(immunization.getDescription())
      .immunizationDate(dateFormatter.format(immunization.getImmunizationDate()))
      .immunizationName(immunization.getImmunizationName())
      .providerName(immunization.getProviderName())
      .providerLocation(immunization.getProviderLocation())
      .build();
  }

  public static List<ImmunizationDTO> convertImmunizationListToImmunizationDTOList(
    List<Immunization> immunizationList
  ) {
    return immunizationList
      .stream()
      .map(ConvertDTOUtil::convertImmunizationToImmunizationDTO)
      .collect(Collectors.toList());
  }

  public static MedicationDTO convertMedicationToMedicationDTO(Medication medication) {
    return MedicationDTO.builder()
      .medicationUuid(medication.getMedicationUuid().toString())
      .dosage(medication.getDosage())
      .dosageUnit(medication.getDosageUnit())
      .isCurrentlyTaking(medication.getIsCurrentlyTaking())
      .medicationStartDate(
        medication.getMedicationStartDate() == null
          ? ""
          : dateFormatter.format(medication.getMedicationStartDate())
      )
      .medicationEndDate(
        medication.getMedicationEndDate() == null
          ? ""
          : dateFormatter.format(medication.getMedicationEndDate())
      )
      .medicationName(medication.getMedicationName())
      .notes(medication.getNotes())
      .build();
  }

  public static List<MedicationDTO> convertMedicationListToMedicationDTOList(
    List<Medication> medicationList
  ) {
    return medicationList
      .stream()
      .map(ConvertDTOUtil::convertMedicationToMedicationDTO)
      .collect(Collectors.toList());
  }

  public static AllergyDTO convertAllergyToAllergyDTO(Allergy allergy) {
    return AllergyDTO.builder()
      .allergyUuid(allergy.getAllergyUuid().toString())
      .description(allergy.getDescription())
      .allergyName(allergy.getAllergyName())
      .isCurrentAllergy(allergy.getIsCurrentAllergy())
      .allergyEndedDate(
        allergy.getAllergyEndedDate() == null
          ? ""
          : dateFormatter.format(allergy.getAllergyEndedDate())
      )
      .allergyStartedDate(
        allergy.getAllergyStartedDate() == null
          ? ""
          : dateFormatter.format(allergy.getAllergyStartedDate())
      )
      .build();
  }

  public static List<AllergyDTO> convertAllergyListToAllergyDTOList(
    List<Allergy> allergyList
  ) {
    return allergyList
      .stream()
      .map(ConvertDTOUtil::convertAllergyToAllergyDTO)
      .collect(Collectors.toList());
  }

  public static LabResultDTO convertLabResultToLabResultDTO(LabResult labResult) {
    return LabResultDTO.builder()
      .labResultName(labResult.getLabResultName())
      .labResultNotes(labResult.getLabResultNotes())
      .labResultDate(
        labResult.getLabResultDate() == null
          ? ""
          : dateFormatter.format(labResult.getLabResultDate())
      )
      .labResultValue(labResult.getLabResultValue())
      .labResultUuid(labResult.getLabResultUuid().toString())
      .labPanelUuid(
        labResult.getLabPanel() == null
          ? null
          : labResult.getLabPanel().getLabPanelUuid().toString()
      )
      .labResultProviderLocation(labResult.getLabResultProviderLocation())
      .labResultProviderName(labResult.getLabResultProviderName())
      .labResultReferenceRange(labResult.getLabResultReferenceRange())
      .build();
  }

  public static List<LabResultDTO> convertLabResultListToLabResultDTOList(
    List<LabResult> labResultList
  ) {
    return labResultList != null
      ? labResultList
        .stream()
        .map(ConvertDTOUtil::convertLabResultToLabResultDTO)
        .collect(Collectors.toList())
      : new ArrayList<>();
  }

  public static LabPanelDTO convertLabPanelToLabPanelDTO(LabPanel labPanel) {
    return LabPanelDTO.builder()
      .labPanelUuid(labPanel.getLabPanelUuid().toString())
      .labPanelName(labPanel.getLabPanelName())
      .labResultsList(
        ConvertDTOUtil.convertLabResultListToLabResultDTOList(
          labPanel.getLabPanelResults()
        )
      )
      .build();
  }

  public static List<LabPanelDTO> convertLabPanelListToLabPanelDTOList(
    List<LabPanel> labPanelList
  ) {
    return labPanelList
      .stream()
      .map(ConvertDTOUtil::convertLabPanelToLabPanelDTO)
      .collect(Collectors.toList());
  }
}
