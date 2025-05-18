package mh.michael.personal_health_record_webapp.config;

import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.dto.ErrorResponseDTO;
import mh.michael.personal_health_record_webapp.exceptions.UserAuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(value = AuthenticationException.class)
  public ResponseEntity<ErrorResponseDTO> authenticationException(
    AuthenticationException e
  ) {
    log.error(e.getMessage(), e);
    ErrorResponseDTO errorResponse = new ErrorResponseDTO(e.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(value = UserAuthenticationException.class)
  public ResponseEntity<ErrorResponseDTO> userAuthenticationException(
    UserAuthenticationException e
  ) {
    log.error(e.getMessage(), e);
    ErrorResponseDTO errorResponse = new ErrorResponseDTO(e.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(value = ResponseStatusException.class)
  public ResponseEntity<ErrorResponseDTO> handleResponseStatusException(
    ResponseStatusException e
  ) {
    log.error(e.getMessage(), e);
    ErrorResponseDTO errorResponse = new ErrorResponseDTO(e.getReason());
    return new ResponseEntity<>(errorResponse, e.getStatus());
  }

  @ExceptionHandler(value = Exception.class)
  public ResponseEntity<ErrorResponseDTO> handleGlobalException(Exception e) {
    log.error(e.getMessage(), e);
    ErrorResponseDTO errorResponse = new ErrorResponseDTO(INTERNAL_SERVER_ERROR_MSG);
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
