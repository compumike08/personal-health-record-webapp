package mh.michael.personal_health_record_webapp.util;

import mh.michael.personal_health_record_webapp.dto.UserDTO;
import mh.michael.personal_health_record_webapp.model.User;
import mh.michael.personal_health_record_webapp.model.UserRole;

import java.util.stream.Collectors;

public class ConvertDTOUtil {
    private ConvertDTOUtil() {}

    public static UserDTO convertUserToUserDTO(User user) {
        return UserDTO.builder()
                .email(user.getEmail())
                .roles(user.getRoles().parallelStream().map(UserRole::getName).collect(Collectors.toSet()))
                .username(user.getUsername())
                .userUuid(user.getUserUuid().toString())
                .build();
    }
}
