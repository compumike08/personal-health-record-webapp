package mh.michael.personal_health_record_webapp.util;

import mh.michael.personal_health_record_webapp.dto.PatientDTO;
import mh.michael.personal_health_record_webapp.dto.UserDTO;
import mh.michael.personal_health_record_webapp.model.Patient;
import mh.michael.personal_health_record_webapp.model.User;
import mh.michael.personal_health_record_webapp.model.UserRole;

import java.util.List;
import java.util.stream.Collectors;

public class ConvertDTOUtil {
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

    public static List<UserDTO> convertUserListToUserDTOList(List<User> userList) {
        return userList.parallelStream().map(ConvertDTOUtil::convertUserToUserDTO).collect(Collectors.toList());
    }

    public static PatientDTO convertPatientToPatientDTO(Patient patient) {
        return PatientDTO.builder()
                .patientUuid(patient.getPatientUuid().toString())
                .patientName(patient.getPatientName())
                .usersList(convertUserListToUserDTOList(patient.getUsers()))
                .build();
    }

    public static List<PatientDTO> convertPatientListToPatientDTOList(List<Patient> patientList) {
        return patientList.parallelStream().map(ConvertDTOUtil::convertPatientToPatientDTO).collect(Collectors.toList());
    }
}
