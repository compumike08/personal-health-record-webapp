package mh.michael.personal_health_record_webapp.exceptions;

public class UserAuthenticationException extends RuntimeException {

  public UserAuthenticationException(String message, Throwable cause) {
    super(message, cause);
  }
}
