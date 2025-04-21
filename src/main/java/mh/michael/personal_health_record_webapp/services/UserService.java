package mh.michael.personal_health_record_webapp.services;

import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.constants.EUserRole;
import mh.michael.personal_health_record_webapp.dto.NewUserRequestDTO;
import mh.michael.personal_health_record_webapp.dto.ResetPasswordRequestDTO;
import mh.michael.personal_health_record_webapp.dto.UserDTO;
import mh.michael.personal_health_record_webapp.model.User;
import mh.michael.personal_health_record_webapp.model.UserRole;
import mh.michael.personal_health_record_webapp.repositories.UserRepository;
import mh.michael.personal_health_record_webapp.repositories.UserRoleRepository;
import mh.michael.personal_health_record_webapp.security.JwtTokenUtil;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.util.AuthorizationUtil;
import mh.michael.personal_health_record_webapp.util.EmailValidationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;
import static mh.michael.personal_health_record_webapp.util.ConvertDTOUtil.convertUserToUserDTO;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthorizationUtil authorizationUtil;

    public UserService(
            UserRepository userRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder encoder,
            JwtTokenUtil jwtTokenUtil,
            AuthorizationUtil authorizationUtil
    ) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.encoder = encoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authorizationUtil = authorizationUtil;
    }

    private void validateUsernameAndEmail(String username, String email) {
        validateUsernameAndEmail(username, email, null);
    }

    private void validateUsernameAndEmail(String username, String email, JwtUserDetails jwtUserDetails) {
        // Validate new username is between 3 and 25 characters long
        if (username.length() < 3 || username.length() > 25) {
            String errMsg = "Username must be at between 3 and 25 characters long";
            log.debug(errMsg);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errMsg);
        }

        if (email.isEmpty() || !EmailValidationUtil.emailPatternMatches(email)) {
            log.debug("Email '{}' is missing or invalid", email);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is missing or invalid");
        }

        if (jwtUserDetails != null) {
            if (!jwtUserDetails.getUsername().equals(username) && userRepository.existsByUsername(username)) {
                log.debug("Username '" + username + "' already exists");
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
            }

            if (!jwtUserDetails.getEmail().equals(email) && userRepository.existsByEmail(email)) {
                log.debug("Email '" + email + "' already exists");
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
            }
        } else {
            if (userRepository.existsByUsername(username)) {
                log.debug("Username '" + username + "' already exists");
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
            }

            if (userRepository.existsByEmail(email)) {
                log.debug("Email '" + email + "' already exists");
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
            }
        }
    }

    @Transactional
    public UserDTO createNewUser(NewUserRequestDTO newUserRequestDTO) {
        validateUsernameAndEmail(newUserRequestDTO.getUsername(), newUserRequestDTO.getEmail());

        User newUser = User.builder()
                .username(newUserRequestDTO.getUsername())
                .email(newUserRequestDTO.getEmail())
                .password(encoder.encode(newUserRequestDTO.getPassword()))
                .userUuid(UUID.randomUUID())
                .patients(new ArrayList<>())
                .build();

        Set<UserRole> roles = new HashSet<>();
        Optional<UserRole> optUserUserRole = userRoleRepository.findByName(EUserRole.ROLE_USER);

        if (optUserUserRole.isEmpty()) {
            log.error("Unable to find user role with name of: {}", EUserRole.ROLE_USER.name());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        roles.add(optUserUserRole.get());
        newUser.setRoles(roles);

        User savedNewUser = userRepository.save(newUser);
        return convertUserToUserDTO(savedNewUser);
    }

    @Transactional
    public UserDTO getCurrentUser(JwtUserDetails jwtUserDetails) {
        UUID userUuid = jwtUserDetails.getUserUuid();
        User user = authorizationUtil.getUserByUserUuid(userUuid);
        return convertUserToUserDTO(user);
    }

    @Transactional
    public UserDTO editUser(UserDTO requestDTO, JwtUserDetails jwtUserDetails) {
        validateUsernameAndEmail(requestDTO.getUsername(), requestDTO.getEmail(), jwtUserDetails);

        User user = authorizationUtil.getUserByUserUuid(jwtUserDetails.getUserUuid());

        user.setUsername(requestDTO.getUsername());
        user.setEmail(requestDTO.getEmail());

        User savedUser = userRepository.save(user);
        return convertUserToUserDTO(savedUser);
    }

    @Transactional
    public UserDTO changeUserPassword(ResetPasswordRequestDTO resetPasswordRequestDTO) {
        String email = jwtTokenUtil.getSubjectFromToken(resetPasswordRequestDTO.getForgotPasswordToken());

        Optional<User> optUser = userRepository.findByEmail(email);

        if (optUser.isEmpty()) {
            log.error("Cannot find email from forgot password token");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        User user = optUser.get();

        if (!jwtTokenUtil.validateTokenForForgotPassword(resetPasswordRequestDTO.getForgotPasswordToken(), user)) {
            log.error("Forgot password token is invalid");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        user.setPassword(encoder.encode(resetPasswordRequestDTO.getNewPassword()));
        User savedUser = userRepository.save(user);
        return convertUserToUserDTO(savedUser);
    }
}
